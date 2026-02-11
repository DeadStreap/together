const pool = require('../config/db');
const crypto = require('crypto');

function createMD5Hash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

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

        const sql = `
            SELECT
                u.*,
                c.id AS couple_id,
                c.start_date AS couple_start_date
            FROM users u
            LEFT JOIN couples c
                ON (c.first_user_id = u.id OR c.second_user_id = u.id)
            WHERE u.id = ?
            LIMIT 1
        `;

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

    async userAuth(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['username', 'password'],
            });
        }

        const sql = `
            SELECT
                u.*,
                c.id AS couple_id,
                c.start_date AS couple_start_date
            FROM users u
            LEFT JOIN couples c
                ON (c.first_user_id = u.id OR c.second_user_id = u.id)
            WHERE u.username = ?
            LIMIT 1
        `;

        try {
            const [rows] = await pool.query(sql, [username]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const user = rows[0];
            
            const hashedPassword = createMD5Hash(password);

            if (user.password !== hashedPassword) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const { password: pwd, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    async updateUser(req, res) {
        const { id, ...fields } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        const allowed = ['username', 'password', 'partner_id', 'color', 'icon'];
        const updates = Object.keys(fields)
            .filter(f => allowed.includes(f) && fields[f] !== undefined)
            .map(f => `${f} = ?`);

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        if (fields.color !== undefined) {
            const validColors = ['Purple', 'Pink', 'Blue', 'Turquoise', 'Green', 'Yellow', 'Orange', 'Red', 'Indigo', 'Purpure', 'LightBlue', 'Emerald'];
            if (!validColors.includes(fields.color)) {
                return res.status(400).json({ error: 'Invalid color value' });
            }
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

            const sql = `
            SELECT
                u.*,
                c.id AS couple_id,
                c.start_date AS couple_start_date
            FROM users u
            LEFT JOIN couples c
                ON (c.first_user_id = u.id OR c.second_user_id = u.id)
            WHERE u.id = ?
            LIMIT 1
        `;
            const [rows] = await pool.query(sql, [id]);
            const updatedUser = rows[0];
            delete updatedUser.password;
            res.json(updatedUser);

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
        const { username, password, partner_id, icon } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['username', 'password']
            });
        }

        try {
            const [existingUsers] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);

            if (existingUsers.length > 0) {
                return res.status(409).json({ error: 'User with this username already exists' });
            }

            const hashedPassword = createMD5Hash(password);

            const partnerIdValue = partner_id !== undefined ? partner_id : null;
            const iconValue = icon !== undefined ? icon : null;
            const sql = `
                INSERT INTO users (
                    username, password, partner_id, icon
                ) VALUES (?, ?, ?, ?)
            `;

            const params = [username, hashedPassword, partnerIdValue, iconValue];

            const [result] = await pool.query(sql, params);

            const [newRow] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            const user = newRow[0];
            delete user.password;
            res.status(201).json(user);

        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }
}

module.exports = new UserController()