const pool = require('../config/db');

class UserController {

    async getUsers(req, res) {
        try {
            const [result] = await pool.query('SELECT * FROM users');
            res.json(result);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async getUserById(req, res) {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in params' });
        }

        const sql = 'SELECT * FROM users WHERE id = ?';

        try {
            const [rows] = await pool.query(sql, [id]);
            if (rows.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.json(rows[0]);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async updateUser(req, res) {
        const { id, ...fields } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        const allowed = ['username', 'password', 'partner_id'];
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
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                params
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            res.json(updated[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        try {
            const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(204).send();

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async createUser(req, res) {
        const { username, password, partner_id } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['username', 'password']
            });
        }

        try {
            const partnerIdValue = partner_id !== undefined ? partner_id : null;
            const sql = `
                INSERT INTO users (
                    username, password, partner_id
                ) VALUES (?, ?, ?)
            `;

            const params = [username, password, partnerIdValue];

            const [result] = await pool.query(sql, params);

            const [newRow] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            res.status(201).json(newRow[0]);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new UserController()