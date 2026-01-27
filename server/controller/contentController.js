const pool = require('../config/db');

class ContentController {

    async getContent(req, res) {
        try {
            const [result] = await pool.query('SELECT * FROM content_items');
            res.json(result);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async getContentById(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const id = req.params.id;
        const sql = 'SELECT * FROM content_items WHERE id = ?';

        try {
            const [rows] = await pool.query(sql, [id]);
            if (rows.length === 0) {
                res.status(404).json('Not found');
            } else {
                res.json(rows);
            }
        } catch (error) {
            res.send(error)
            console.error(error);
            res.status(500).send('Server error');
        }
    }

}
console.log('Exported controller:', new ContentController());
module.exports = new ContentController()