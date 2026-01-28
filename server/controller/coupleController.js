const pool = require('../config/db');

class CoupleController {

    async getCouples(req, res) {
        try {
            const [result] = await pool.query('SELECT * FROM couples');
            res.json(result);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async getCoupleById(req, res) {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in params' });
        }

        const sql = 'SELECT * FROM couples WHERE id = ?';

        try {
            const [rows] = await pool.query(sql, [id]);
            if (rows.length === 0) {
                res.status(404).json({ error: 'Couple not found' });
            } else {
                res.json(rows[0]);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async updateCouple(req, res) {
        const { id, ...fields } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        const allowed = ['first_user_id', 'second_user_id', 'start_date'];
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
                `UPDATE couples SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Couple not found' });
            }

            const [updated] = await pool.query('SELECT * FROM couples WHERE id = ?', [id]);
            res.json(updated[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async deleteCouple(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        try {
            const [result] = await pool.query('DELETE FROM couples WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Couple not found' });
            }

            res.status(204).send();

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async createCouple(req, res) {
        const { first_user_id, second_user_id, start_date } = req.body;

        if (!first_user_id || !second_user_id) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['first_user_id', 'second_user_id']
            });
        }

        try {
            const startDateValue = start_date !== undefined ? start_date : null;
            const sql = `
                INSERT INTO couples (
                    first_user_id, second_user_id, start_date
                ) VALUES (?, ?, ?)
            `;

            const params = [first_user_id, second_user_id, startDateValue];

            const [result] = await pool.query(sql, params);

            const [newRow] = await pool.query('SELECT * FROM couples WHERE id = ?', [result.insertId]);
            res.status(201).json(newRow[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new CoupleController()