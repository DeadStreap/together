const pool = require('../config/db');

class CommentController {

    async getComments(req, res) {
        try {
            const [result] = await pool.query('SELECT * FROM comments');
            res.json(result);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async getCommentById(req, res) {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        const sql = 'SELECT * FROM comments WHERE id = ?';

        try {
            const [rows] = await pool.query(sql, [id]);
            if (rows.length === 0) {
                res.status(404).json('Not found');
            } else {
                res.json(rows[0]);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }

    async getCommentsByContentId(req, res) {
        const { contentId } = req.params;
        const { userId } = req.query;

        if (!contentId) {
            return res.status(400).json({ error: 'Content ID is required' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const [contentResult] = await pool.query(
                'SELECT added_by_user_id FROM content_items WHERE id = ?',
                [contentId]
            );

            if (contentResult.length === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }

            const contentOwnerId = contentResult[0].added_by_user_id;

            const [userResult] = await pool.query(
                'SELECT partner_id FROM users WHERE id = ?',
                [userId]
            );

            if (userResult.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userPartnerId = userResult[0].partner_id;

            const isOwner = parseInt(userId) === contentOwnerId;
            const isPartner = userPartnerId && parseInt(userPartnerId) === contentOwnerId;

            if (!isOwner && !isPartner) {
                return res.status(403).json({ error: 'Access denied' });
            }

            const sql = `
                SELECT 
                    c.*,
                    u.username,
                    u.color,
                    u.icon
                FROM comments c
                LEFT JOIN users u ON u.id = c.user_id
                WHERE c.content_item_id = ?
                ORDER BY c.created_at DESC
            `;

            const [comments] = await pool.query(sql, [contentId]);
            res.json(comments);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async updateComment(req, res) {
        const { id, comment_text, user_id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const [existingComment] = await pool.query(
                'SELECT user_id FROM comments WHERE id = ?',
                [id]
            );

            if (existingComment.length === 0) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            if (existingComment[0].user_id !== user_id) {
                return res.status(403).json({ error: 'You can only edit your own comments' });
            }
        } catch (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ error: 'Server error' });
        }

        const updates = [];
        const params = [];

        if (comment_text !== undefined) {
            if (comment_text && comment_text.length > 400) {
                return res.status(400).json({ error: 'Comment text must not exceed 400 characters' });
            }
            updates.push('comment_text = ?');
            params.push(comment_text);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        params.push(id);

        try {
            const [result] = await pool.query(
                `UPDATE comments SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            const [updated] = await pool.query(
                `
                SELECT 
                    c.*,
                    u.username,
                    u.color,
                    u.icon
                FROM comments c
                LEFT JOIN users u ON u.id = c.user_id
                WHERE c.id = ?
                `,
                [id]
            );
            res.json(updated[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async deleteComment(req, res) {
        const { id, user_id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const [existingComment] = await pool.query(
                'SELECT user_id FROM comments WHERE id = ?',
                [id]
            );

            if (existingComment.length === 0) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            if (existingComment[0].user_id !== user_id) {
                return res.status(403).json({ error: 'You can only delete your own comments' });
            }

            const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            res.status(204).send();

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async createComment(req, res) {
        const { content_item_id, user_id, comment_text } = req.body;

        if (!content_item_id || !user_id || !comment_text) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['content_item_id', 'user_id', 'comment_text']
            });
        }

        const trimmedText = comment_text.trim();

        if (trimmedText.length === 0) {
            return res.status(400).json({ error: 'Comment text cannot be empty' });
        }

        if (trimmedText.length > 400) {
            return res.status(400).json({ error: 'Comment text must not exceed 400 characters' });
        }

        try {
            const [contentResult] = await pool.query(
                'SELECT added_by_user_id FROM content_items WHERE id = ?',
                [content_item_id]
            );

            if (contentResult.length === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }

            const contentOwnerId = contentResult[0].added_by_user_id;

            const [userResult] = await pool.query(
                'SELECT partner_id FROM users WHERE id = ?',
                [user_id]
            );

            if (userResult.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userPartnerId = userResult[0].partner_id;

            const isOwner = parseInt(user_id) === contentOwnerId;
            const isPartner = userPartnerId && parseInt(userPartnerId) === contentOwnerId;

            if (!isOwner && !isPartner) {
                return res.status(403).json({ error: 'Access denied' });
            }

            const sql = `
                INSERT INTO comments (
                    content_item_id, user_id, comment_text
                ) VALUES (?, ?, ?)
            `;

            const params = [content_item_id, user_id, trimmedText];

            const [result] = await pool.query(sql, params);

            const [newRow] = await pool.query(
                `
                SELECT 
                    c.*,
                    u.username,
                    u.color,
                    u.icon
                FROM comments c
                LEFT JOIN users u ON u.id = c.user_id
                WHERE c.id = ?
                `,
                [result.insertId]
            );
            res.status(201).json(newRow[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new CommentController()
