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

export const getAllUser = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Not authenticated',
        });
      }
  
      // Get user details with order statistics using a single query
      const userStats = await query(
        `SELECT 
          u.id,
          u.name,
          u.email,
          u.phone_number,
          u.address,
          u.created_at,
          COUNT(DISTINCT o.id) as total_orders,
          COALESCE(SUM(o.total_price), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id, u.name, u.email`,
        []
      );
  
    //   if (userStats.rows.length === 0) {
    //     return res.status(404).json({
    //       status: 'error',
    //       message: 'User not found',
    //     });
    //   }
  
      return res.status(200).json({
        status: 'success',
        data: userStats.rows,
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to get user(s) statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

export const getUserDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const { id } = req.params;

    // Get user details with order statistics
    const userDetails = await query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u.phone_number,
        u.address,
        u.created_at,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_price), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email, u.phone_number, u.address, u.created_at`,
      [id]
    );

    if (userDetails.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Get user's orders
    const orders = await query(
      `SELECT 
        o.id,
        o.created_at as date,
        o.total_price as total,
        o.status,
        COUNT(oi.id) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id, o.created_at, o.total_price, o.status
      ORDER BY o.created_at DESC`,
      [id]
    );

    return res.status(200).json({
      status: 'success',
      data: {
        ...userDetails.rows[0],
        orders: orders.rows
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user details',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};