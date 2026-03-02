const pool = require('../config/db');

class StatsController {

    async getCategoryStats(req, res) {
        const userId = req.params.userId;
        const partnerId = req.params.partnerId;
        const { startDate, endDate } = req.query;

        if (!userId || !partnerId) {
            return res.status(400).json({ error: "User ID and Partner ID are required" });
        }

        let dateFilter = '';
        const params = [userId, partnerId];

        if (startDate || endDate) {
            dateFilter = 'AND (';
            const conditions = [];
            if (startDate) {
                conditions.push('(added_at >= ? OR start_date >= ?)');
                params.push(startDate, startDate);
            }
            if (endDate) {
                conditions.push('(added_at <= ? OR start_date <= ?)');
                params.push(endDate, endDate);
            }
            dateFilter += conditions.join(' AND ') + ')';
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
                ${dateFilter}
            GROUP BY category
            ORDER BY total DESC
        `;

        try {
            const [result] = await pool.query(sql, params);
            res.json(result);
        } catch (err) {
            console.error("DB Error:", err);
            res.status(500).json({ error: err.message });
        }
    }

    async getMonthlyStats(req, res) {
        const userId = req.params.userId;
        const partnerId = req.params.partnerId;

        const sql = `
            SELECT
                month_period,
                SUM(total) as total,
                SUM(completed) as completed
            FROM (
                SELECT
                    DATE_FORMAT(added_at, '%Y-%m') as month_period,
                    COUNT(*) as total,
                    0 as completed
                FROM content_items
                WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                    AND shared_with_partner = TRUE
                GROUP BY DATE_FORMAT(added_at, '%Y-%m')

                UNION ALL

                SELECT
                    DATE_FORMAT(end_date, '%Y-%m') as month_period,
                    0 as total,
                    COUNT(*) as completed
                FROM content_items
                WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                    AND shared_with_partner = TRUE
                    AND status = 'done'
                    AND end_date IS NOT NULL
                GROUP BY DATE_FORMAT(end_date, '%Y-%m')
            ) as combined
            WHERE month_period IS NOT NULL
            GROUP BY month_period
            ORDER BY month_period ASC
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
        const { startDate, endDate } = req.query;

        if (!userId || !partnerId) {
            return res.status(400).json({ error: "User ID and Partner ID are required" });
        }

        let dateFilter = '';
        const params = [userId, partnerId];

        if (startDate || endDate) {
            dateFilter = 'AND (';
            const conditions = [];
            if (startDate) {
                conditions.push('(added_at >= ? OR start_date >= ?)');
                params.push(startDate, startDate);
            }
            if (endDate) {
                conditions.push('(added_at <= ? OR start_date <= ?)');
                params.push(endDate, endDate);
            }
            dateFilter += conditions.join(' AND ') + ')';
        }

        const sql = `
            SELECT
                status,
                COUNT(*) as count
            FROM content_items
            WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                AND shared_with_partner = TRUE
                ${dateFilter}
            GROUP BY status
        `;

        try {
            const [result] = await pool.query(sql, params);

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

    async getCompletionCurve(req, res) {
        const userId = req.params.userId;
        const partnerId = req.params.partnerId;

        const sql = `
            SELECT 
                completion_date,
                completed_count,
                SUM(completed_count) OVER (ORDER BY completion_date ASC) as cumulative_count
            FROM (
                SELECT 
                    DATE(end_date) as completion_date,
                    COUNT(*) as completed_count
                FROM content_items
                WHERE (added_by_user_id = ? OR added_by_user_id = ?)
                    AND shared_with_partner = TRUE
                    AND status = 'done'
                    AND end_date IS NOT NULL
                GROUP BY DATE(end_date)
                ORDER BY completion_date ASC
            ) as daily_completions
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
