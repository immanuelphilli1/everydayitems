import { query } from '../config/db.js';

// Get cart items for a user
export const getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;

    // Get cart items with product details
    const cartItems = await query(`
      SELECT c.id, c.user_id, c.product_id, c.quantity,
             p.name, p.price, p.image
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [userId]);

    return res.status(200).json({
      status: 'success',
      items: cartItems.rows,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get cart items',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await query('SELECT * FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    // Check if item already exists in cart
    const existingItem = await query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity if item exists
      const newQuantity = existingItem.rows[0].quantity + quantity;

      const updatedItem = await query(
        'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [newQuantity, existingItem.rows[0].id]
      );

      return res.status(200).json({
        status: 'success',
        message: 'Cart item updated',
        item: updatedItem.rows[0],
      });
    } else {
      // Add new item to cart
      const newItem = await query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [userId, productId, quantity]
      );

      return res.status(201).json({
        status: 'success',
        message: 'Product added to cart',
        item: newItem.rows[0],
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to add item to cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be greater than 0',
      });
    }

    // Check if item exists in user's cart
    const cartItem = await query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found',
      });
    }

    // Update quantity
    const updatedItem = await query(
      'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [quantity, cartItem.rows[0].id]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Cart item updated',
      item: updatedItem.rows[0],
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update cart item',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;
    const { productId } = req.params;

    // Check if item exists in user's cart
    const cartItem = await query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found',
      });
    }

    // Remove item
    await query(
      'DELETE FROM cart_items WHERE id = $1',
      [cartItem.rows[0].id]
    );

    return res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to remove item from cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;

    // Delete all items from user's cart
    await query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    return res.status(200).json({
      status: 'success',
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to clear cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Sync cart - for merging guest cart with user cart after login
export const syncCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    const userId = req.user.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      // If no items to sync, just return current cart
      return getCart(req, res);
    }

    // Begin transaction
    await query('BEGIN');

    for (const item of items) {
      const { productId, quantity } = item;

      // Check if product exists
      const product = await query('SELECT * FROM products WHERE id = $1', [productId]);
      if (product.rows.length === 0) continue; // Skip invalid products

      // Check if item already exists in user's cart
      const existingItem = await query(
        'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      );

      if (existingItem.rows.length > 0) {
        // Update quantity if item exists (add to existing quantity)
        const newQuantity = existingItem.rows[0].quantity + quantity;
        await query(
          'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2',
          [newQuantity, existingItem.rows[0].id]
        );
      } else {
        // Add new item to cart
        await query(
          'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
          [userId, productId, quantity]
        );
      }
    }

    // Commit transaction
    await query('COMMIT');

    // Return updated cart
    return getCart(req, res);
  } catch (error) {
    // Rollback transaction on error
    await query('ROLLBACK');

    console.error('Sync cart error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to sync cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
