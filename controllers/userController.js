import { query } from '../config/db.js';

// Get user details with order statistics
export const getUserStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;

    // Get user details with order statistics using a single query
    const userStats = await query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_price), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email`,
      [userId]
    );

    if (userStats.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: userStats.rows[0],
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};