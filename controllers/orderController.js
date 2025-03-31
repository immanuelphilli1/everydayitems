import { query } from '../config/db.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;
    const {
      shippingAddress,
      paymentMethod,
      items,
      totalPrice,
      shippingPrice,
      taxPrice,
    } = req.body;

    // Begin transaction
    await query('BEGIN');

    // Create order
    const newOrder = await query(
      `INSERT INTO orders
       (user_id, shipping_address, payment_method, total_price, shipping_price, tax_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, shippingAddress, paymentMethod, totalPrice, shippingPrice, taxPrice, 'pending']
    );

    const orderId = newOrder.rows[0].id;

    // Add order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items
         (order_id, product_id, name, quantity, price, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.productId, item.name, item.quantity, item.price, item.image]
      );
    }

    // Clear user's cart
    await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    // Commit transaction
    await query('COMMIT');

    return res.status(201).json({
      status: 'success',
      order: newOrder.rows[0],
    });
  } catch (error) {
    // Rollback transaction on error
    await query('ROLLBACK');

    console.error('Create order error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;

    const orders = await query(
      `SELECT * FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      status: 'success',
      orders: orders.rows,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get order details
export const getOrderDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;
    const { id } = req.params;

    // Get order
    const order = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Get order items
    const orderItems = await query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    return res.status(200).json({
      status: 'success',
      order: {
        ...order.rows[0],
        items: orderItems.rows,
      },
    });
  } catch (error) {
    console.error('Get order details error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get order details',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    return res.status(200).json({
      status: 'success',
      orders: orders.rows,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if order exists
    const order = await query('SELECT * FROM orders WHERE id = $1', [id]);
    if (order.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Update order status
    const updatedOrder = await query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    return res.status(200).json({
      status: 'success',
      order: updatedOrder.rows[0],
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update order status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
