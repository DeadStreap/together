const pool = require('../config/db');

class ContentController {

    async getContent(req, res) {
        const sql = `
        SELECT 
            ci.*,
            u.username AS added_by
        FROM content_items ci
        LEFT JOIN users u
            ON u.id = ci.added_by_user_id
    `;

        try {
            const [result] = await pool.query(sql);
            res.json(result);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }


    async getContentById(req, res) {
        const id = req.params.id;
        const sql = `
        SELECT
            ci.*,
            u.username AS added_by
        FROM content_items ci
        LEFT JOIN users u
            ON u.id = ci.added_by_user_id
        WHERE ci.id = ?
    `;

        try {
            const [rows] = await pool.query(sql, [id]);

            if (rows.length === 0) {
                res.status(404).json({ error: 'Not found' });
            } else {
                res.json(rows[0]); // Возвращаем один объект, а не массив
            }
        } catch (error) {
            console.error('DB Error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }


    async updateContentById(req, res) {
        const { id, ...fields } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        const allowed = ['title', 'category', 'added_by_user_id', 'shared_with_partner', 'status', 'start_date', 'end_date'];
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
                `UPDATE content_items SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }

            const [updated] = await pool.query('SELECT * FROM content_items WHERE id = ?', [id]);
            res.json(updated[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }


    async deleteContent(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        try {
            const [result] = await pool.query('DELETE FROM content_items WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }

            res.status(204).send();

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }


    async createContent(req, res) {
        const { title, category, added_by_user_id, shared_with_partner, status, start_date, end_date } = req.body;

        if (!title || !category || !added_by_user_id) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['title', 'category', 'added_by_user_id']
            });
        }

        try {
            const statusValue = status !== undefined ? status : '';
            const sharedWithPartnerValue = shared_with_partner !== undefined ? shared_with_partner : false;
            const sql = `
            INSERT INTO content_items (
                title, category, added_by_user_id, shared_with_partner, status, start_date, end_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

            const params = [
                title, category, added_by_user_id,
                sharedWithPartnerValue, statusValue, start_date, end_date
            ];

            const [result] = await pool.query(sql, params);

            const [newRow] = await pool.query('SELECT * FROM content_items WHERE id = ?', [result.insertId]);
            res.status(201).json(newRow[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }



}

module.exports = new ContentController()