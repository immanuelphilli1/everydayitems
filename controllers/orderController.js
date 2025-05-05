import { query } from '../config/db.js';

// Create a new order
export const createOrder = async (req, res) => {
  console.log("Orders to create : ", req.body)
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

    console.log(items);

    // Add order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items
         (order_id, product_id, name, quantity, price, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product_id, item.name, item.quantity, item.price, item.image]
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

    // Get orders with their items
    const orders = await query(
      `SELECT o.*, 
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'name', oi.name,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'image', oi.image
                )
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    // Replace null items array with empty array if no items
    const ordersWithItems = orders.rows.map(order => ({
      ...order,
      items: order.items[0] === null ? [] : order.items
    }));

    return res.status(200).json({
      status: 'success',
      orders: ordersWithItems,
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

export const getUserOrderDetails = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    // const userId = req.user.id;
    const { id } = req.params;

    // Get order
    const order = await query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
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

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if order exists and belongs to the user
    const order = await query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
    if (order.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Begin transaction
    await query('BEGIN');

    // Delete order items first (due to foreign key constraint)
    await query('DELETE FROM order_items WHERE order_id = $1', [id]);

    // Delete the order
    await query('DELETE FROM orders WHERE id = $1', [id]);

    // Commit transaction
    await query('COMMIT');

    return res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully',
    });
  } catch (error) {
    // Rollback transaction on error
    await query('ROLLBACK');

    console.error('Delete order error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
