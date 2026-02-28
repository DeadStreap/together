const pool = require('../config/db');

class StatsController {

    async getCategoryStats(req, res) {
        const userId = req.params.userId;
        const partnerId = req.params.partnerId;

        if (!userId || !partnerId) {
            return res.status(400).json({ error: "User ID and Partner ID are required" });
        }

        const sql = `
            SELECT
                category,
                COUNT(*) as total,
                CAST(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS UNSIGNED) as completed,
                CAST(SUM(CASE WHEN status = 'inProgress' THEN 1 ELSE 0 END) AS UNSIGNED) as in_progress,
                CAST(SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) AS UNSIGNED) as planned
            FROM content_items
            WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                AND shared_with_partner = TRUE
            GROUP BY category
            ORDER BY total DESC
        `;

        try {
            const [result] = await pool.query(sql, [userId, partnerId]);
            res.json(result);
        } catch (err) {
            console.error("DB Error:", err);
            res.status(500).json({ error: err.message });
        }
    }

    async getMonthlyStats(req, res) {
        const userId = req.params.userId;
        const partnerId = req.params.partnerId;
        const { months = 6 } = req.query;

        const sql = `
            SELECT
                added_month,
                SUM(total) as total,
                SUM(completed) as completed
            FROM (
                SELECT
                    DATE_FORMAT(added_at, '%Y-%m') as added_month,
                    COUNT(*) as total,
                    0 as completed
                FROM content_items
                WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                GROUP BY DATE_FORMAT(added_at, '%Y-%m')
                
                UNION ALL
                
                SELECT
                    DATE_FORMAT(end_date, '%Y-%m') as completed_month,
                    0 as total,
                    COUNT(*) as completed
                FROM content_items
                WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                    AND status = 'done'
                    AND end_date IS NOT NULL
                GROUP BY DATE_FORMAT(end_date, '%Y-%m')
            ) as combined
            GROUP BY added_month
            ORDER BY added_month ASC
        `;

        try {
            const [result] = await pool.query(sql, [userId, partnerId, userId, partnerId]);
            res.json(result);
        } catch (err) {
            console.error("DB Error:", err);
            res.status(500).json({ error: err.message });
        }
    }

    async getStatusStats(req, res) {
        const userId = req.params.userId;
        const partnerId = req.params.partnerId;

        const sql = `
            SELECT 
                status,
                COUNT(*) as count
            FROM content_items
            WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                AND shared_with_partner = TRUE
            GROUP BY status
        `;

        try {
            const [result] = await pool.query(sql, [userId, partnerId]);
            
            const stats = {
                planned: 0,
                inProgress: 0,
                done: 0
            };
            
            result.forEach(row => {
                stats[row.status] = row.count;
            });
            
            res.json(stats);
        } catch (err) {
            console.error("DB Error:", err);
            res.status(500).json({ error: err.message });
        }
    }

    async getCompletionRateByCategory(req, res) {
        const userId = req.params.userId;
        const partnerId = req.params.partnerId;

        const sql = `
            SELECT
                category,
                COUNT(*) as total,
                CAST(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS UNSIGNED) as completed,
                CAST(ROUND(
                    SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
                    1
                ) AS DECIMAL(5,1)) as completion_rate
            FROM content_items
            WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                AND shared_with_partner = TRUE
            GROUP BY category
            HAVING total >= 1
            ORDER BY completion_rate DESC
        `;

        try {
            const [result] = await pool.query(sql, [userId, partnerId]);
            res.json(result);
        } catch (err) {
            console.error("DB Error:", err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new StatsController();
