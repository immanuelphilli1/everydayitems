import { query } from '../config/db.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total revenue
    const revenueResult = await query(
      `SELECT 
        COALESCE(SUM(total_price), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN total_price ELSE 0 END), 0) as last_month_revenue
       FROM orders 
       WHERE status != 'cancelled'`
    );

    // Get total orders
    const ordersResult = await query(
      `SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_month_orders
       FROM orders`
    );

    // Get total customers
    const customersResult = await query(
      `SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_month_customers
       FROM users 
       WHERE role = 'user'`
    );

    // Get total products
    const productsResult = await query(
      `SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as last_month_products
       FROM products`
    );

    const {
      total_revenue,
      last_month_revenue
    } = revenueResult.rows[0];

    const {
      total_orders,
      last_month_orders
    } = ordersResult.rows[0];

    const {
      total_customers,
      last_month_customers
    } = customersResult.rows[0];

    const {
      total_products,
      last_month_products
    } = productsResult.rows[0];

    // Calculate percentage changes
    const revenueChange = last_month_revenue > 0 
      ? ((total_revenue - last_month_revenue) / last_month_revenue) * 100 
      : 0;
    
    const ordersChange = last_month_orders > 0 
      ? ((total_orders - last_month_orders) / last_month_orders) * 100 
      : 0;
    
    const customersChange = last_month_customers > 0 
      ? ((total_customers - last_month_customers) / last_month_customers) * 100 
      : 0;
    
    const productsChange = last_month_products > 0 
      ? ((total_products - last_month_products) / last_month_products) * 100 
      : 0;

    return res.status(200).json({
      status: 'success',
      data: {
        totalRevenue: parseFloat(total_revenue),
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        totalOrders: parseInt(total_orders),
        ordersChange: parseFloat(ordersChange.toFixed(1)),
        totalCustomers: parseInt(total_customers),
        customersChange: parseFloat(customersChange.toFixed(1)),
        totalProducts: parseInt(total_products),
        productsChange: parseFloat(productsChange.toFixed(1))
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get recent orders
export const getRecentOrders = async (req, res) => {
  try {
    const orders = await query(
      `SELECT 
        o.id,
        u.name as customer,
        o.created_at as date,
        o.total_price as amount,
        o.status
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    return res.status(200).json({
      status: 'success',
      orders: orders.rows.map(order => ({
        ...order,
        date: new Date(order.date).toISOString().split('T')[0]
      }))
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get recent orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    // Get recent orders
    const recentOrders = await query(
      `SELECT 
        o.id,
        u.name as customer_name,
        o.created_at,
        o.total_price,
        'order' as type
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    // Get recent user registrations
    const recentUsers = await query(
      `SELECT 
        id,
        name,
        created_at,
        'user' as type
       FROM users
       WHERE role = 'user'
       ORDER BY created_at DESC
       LIMIT 5`
    );

    // Get recent product updates
    const recentProducts = await query(
      `SELECT 
        id,
        name,
        created_at,
        'product' as type
       FROM products
       ORDER BY created_at DESC
       LIMIT 5`
    );

    // Combine and sort all activities
    const activities = [
      ...recentOrders.rows.map(order => ({
        ...order,
        created_at: new Date(order.created_at).toISOString(),
        description: `New order from ${order.customer_name} for $${order.total_price}`
      })),
      ...recentUsers.rows.map(user => ({
        ...user,
        created_at: new Date(user.created_at).toISOString(),
        description: `New user registered: ${user.name}`
      })),
      ...recentProducts.rows.map(product => ({
        ...product,
        created_at: new Date(product.created_at).toISOString(),
        description: `New product added: ${product.name}`
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
     .slice(0, 5);

    return res.status(200).json({
      status: 'success',
      activities
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get recent activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 