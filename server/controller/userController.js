const pool = require('../config/db');
const crypto = require('crypto');

const USER_WITH_COUPLE_SQL = `
    SELECT
        u.*,
        c.id AS couple_id,
        c.start_date AS couple_start_date
    FROM users u
    LEFT JOIN couples c
        ON (c.first_user_id = u.id OR c.second_user_id = u.id)
`;

function createMD5Hash(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

class UserController {

    async getUsers(req, res) {
        const [result] = await pool.query('SELECT * FROM users');
        res.json(result);
    }

    async getUserById(req, res) {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in params' });
        }

        const [rows] = await pool.query(
            USER_WITH_COUPLE_SQL + ' WHERE u.id = ? LIMIT 1',
            [id]
        );
        if (rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(rows[0]);
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

        const [rows] = await pool.query(
            USER_WITH_COUPLE_SQL + ' WHERE u.username = ? LIMIT 1',
            [username]
        );

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

        const params = Object.values(fields).filter(v => v !== undefined);
        params.push(id);

        const [result] = await pool.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const [rows] = await pool.query(
            USER_WITH_COUPLE_SQL + ' WHERE u.id = ? LIMIT 1',
            [id]
        );
        const updatedUser = rows[0];
        delete updatedUser.password;
        res.json(updatedUser);
    }

    async deleteUser(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in body' });
        }

        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(204).send();
    }

    async createUser(req, res) {
        const { username, password, partner_id, icon } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['username', 'password']
            });
        }

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
    }

    async generateToken(req, res) {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        let token = Math.floor(100000 + Math.random() * 900000).toString();
        
        let tokenExists = true;
        while(tokenExists) {
            const [result] = await pool.query('SELECT id FROM users WHERE token = ?', [token]);
            if(result.length === 0) {
                tokenExists = false;
            } else {
                token = Math.floor(100000 + Math.random() * 900000).toString();
            }
        }
        
        const [result] = await pool.query(
            'UPDATE users SET token = ? WHERE id = ?',
            [token, userId]
        );

        if(result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const [updatedUserResult] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const updatedUser = updatedUserResult[0];
        delete updatedUser.password;
        res.json(updatedUser);
    }

    async joinCouple(req, res) {
        const { userId, partnerToken } = req.body;

        if (!userId || !partnerToken) {
            return res.status(400).json({ 
                error: 'User ID and partner token are required' 
            });
        }

        const [partnerResult] = await pool.query(
            'SELECT id FROM users WHERE token = ?',
            [partnerToken]
        );

        if(partnerResult.length === 0) {
            return res.status(404).json({ error: 'User with this token not found' });
        }

        const partnerId = partnerResult[0].id;

        if(userId === partnerId) {
            return res.status(400).json({ error: 'Cannot join couple with yourself' });
        }

        const [currentUserResult] = await pool.query(
            'SELECT partner_id FROM users WHERE id = ?',
            [userId]
        );
        
        const [partnerUserResult] = await pool.query(
            'SELECT partner_id FROM users WHERE id = ?',
            [partnerId]
        );

        if(currentUserResult[0].partner_id || partnerUserResult[0].partner_id) {
            return res.status(400).json({ error: 'One of the users already has a partner' });
        }

        await pool.query(
            'UPDATE users SET partner_id = ? WHERE id = ?',
            [partnerId, userId]
        );

        await pool.query(
            'UPDATE users SET partner_id = ? WHERE id = ?',
            [userId, partnerId]
        );

        await pool.query(
            'UPDATE users SET token = NULL WHERE id IN (?, ?)',
            [userId, partnerId]
        );

        res.json({ success: true, message: 'Successfully joined couple' });
    }
}

module.exports = new UserController()
