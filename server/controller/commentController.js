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

    async updateComment(req, res) {
        const { id, ...fields } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        const allowed = ['content_item_id', 'user_id', 'comment_text'];
        const updates = Object.keys(fields)
            .filter(f => allowed.includes(f) && fields[f] !== undefined)
            .map(f => `${f} = ?`);

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        try {
            const params = Object.values(fields).filter(v => v !== undefined);
            params.push(id);

            const [result] = await pool.query(
                `UPDATE comments SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Comment not found' });
            }

            const [updated] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
            res.json(updated[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async deleteComment(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        try {
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

        try {
            const sql = `
                INSERT INTO comments (
                    content_item_id, user_id, comment_text
                ) VALUES (?, ?, ?)
            `;

            const params = [content_item_id, user_id, comment_text];

            const [result] = await pool.query(sql, params);

            const [newRow] = await pool.query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
            res.status(201).json(newRow[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new CommentController()