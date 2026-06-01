const pool = require('../config/db');

const ALLOWED_CATEGORIES = ['game', 'anime', 'film', 'serial'];

class SuggestionController {

    async getSuggestions(req, res) {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const sql = `
                SELECT
                    s.*,
                    u.username AS suggested_by_username
                FROM suggestions s
                LEFT JOIN users u ON u.id = s.suggested_by
                WHERE s.suggested_to = ? OR s.suggested_by = ?
                ORDER BY s.created_at DESC
            `;

            const [rows] = await pool.query(sql, [userId, userId]);
            res.json(rows);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async createSuggestion(req, res) {
        const { title, category, suggested_by, suggested_to } = req.body;

        if (!title || !category || !suggested_by || !suggested_to) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['title', 'category', 'suggested_by', 'suggested_to']
            });
        }

        if (!ALLOWED_CATEGORIES.includes(category)) {
            return res.status(400).json({
                error: 'Invalid category',
                allowed: ALLOWED_CATEGORIES
            });
        }

        try {
            const [userRows] = await pool.query(
                'SELECT partner_id FROM users WHERE id = ?',
                [suggested_by]
            );

            if (userRows.length === 0) {
                return res.status(404).json({ error: 'Suggested by user not found' });
            }

            if (userRows[0].partner_id !== parseInt(suggested_to)) {
                return res.status(403).json({ error: 'Users are not partners' });
            }

            const sql = `
                INSERT INTO suggestions (title, category, suggested_by, suggested_to)
                VALUES (?, ?, ?, ?)
            `;

            const [result] = await pool.query(sql, [title, category, suggested_by, suggested_to]);

            const [newRow] = await pool.query(
                `SELECT s.*, u.username AS suggested_by_username
                 FROM suggestions s
                 LEFT JOIN users u ON u.id = s.suggested_by
                 WHERE s.id = ?`,
                [result.insertId]
            );

            res.status(201).json(newRow[0]);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async acceptSuggestion(req, res) {
        const suggestionId = req.params.id;
        const { user_id } = req.body;

        if (!suggestionId) {
            return res.status(400).json({ error: 'Suggestion ID is required' });
        }

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const [suggestionRows] = await pool.query(
                'SELECT * FROM suggestions WHERE id = ?',
                [suggestionId]
            );

            if (suggestionRows.length === 0) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            const suggestion = suggestionRows[0];

            if (parseInt(suggestion.suggested_to) !== parseInt(user_id)) {
                return res.status(403).json({ error: 'Only the recipient can accept this suggestion' });
            }

            if (suggestion.status !== 'pending') {
                return res.status(400).json({ error: 'Suggestion is not pending' });
            }

            const contentSql = `
                INSERT INTO content_items (
                    title, category, added_by_user_id, shared_with_partner, status, added_at
                ) VALUES (?, ?, ?, TRUE, 'planned', NOW())
            `;

            const [contentResult] = await pool.query(contentSql, [
                suggestion.title, suggestion.category, suggestion.suggested_by
            ]);

            const suggestionSql = 'DELETE FROM suggestions WHERE id = ?';
            await pool.query(suggestionSql, [suggestionId]);

            const [newContent] = await pool.query(
                'SELECT * FROM content_items WHERE id = ?',
                [contentResult.insertId]
            );

            res.json({
                message: 'Suggestion accepted',
                activity: newContent[0]
            });
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async declineSuggestion(req, res) {
        const suggestionId = req.params.id;
        const { user_id } = req.body;

        if (!suggestionId) {
            return res.status(400).json({ error: 'Suggestion ID is required' });
        }

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const [suggestionRows] = await pool.query(
                'SELECT * FROM suggestions WHERE id = ?',
                [suggestionId]
            );

            if (suggestionRows.length === 0) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            const suggestion = suggestionRows[0];

            const isRecipient = parseInt(suggestion.suggested_to) === parseInt(user_id);
            const isAuthor = parseInt(suggestion.suggested_by) === parseInt(user_id);

            if (!isRecipient && !isAuthor) {
                return res.status(403).json({ error: 'You cannot decline this suggestion' });
            }

            if (suggestion.status !== 'pending') {
                return res.status(400).json({ error: 'Suggestion is not pending' });
            }

            await pool.query('DELETE FROM suggestions WHERE id = ?', [suggestionId]);

            res.json({ message: 'Suggestion declined' });
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new SuggestionController();
