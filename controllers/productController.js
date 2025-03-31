import { query } from '../config/db.js';

// Get all products with pagination, sorting, and filtering
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'created_at',
      order = 'DESC',
      category,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    // Build query conditions
    let conditions = [];
    let parameters = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`category = $${paramIndex}`);
      parameters.push(category);
      paramIndex++;
    }

    if (minPrice) {
      conditions.push(`price >= $${paramIndex}`);
      parameters.push(minPrice);
      paramIndex++;
    }

    if (maxPrice) {
      conditions.push(`price <= $${paramIndex}`);
      parameters.push(maxPrice);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      parameters.push(`%${search}%`);
      paramIndex++;
    }

    // Build WHERE clause if there are conditions
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total products matching the filter
    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const countResult = await query(countQuery, parameters);
    const totalProducts = parseInt(countResult.rows[0].count);

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Add pagination parameters
    parameters.push(limitNum);
    parameters.push(offset);

    // Get filtered products with pagination
    const productsQuery = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY ${sort} ${order}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const products = await query(productsQuery, parameters);

    return res.status(200).json({
      status: 'success',
      results: products.rows.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      products: products.rows,
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (product.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      product: product.rows[0],
    });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create a new product (admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      original_price,
      image,
      category,
      stock,
      featured,
    } = req.body;

    const newProduct = await query(
      `INSERT INTO products
      (name, description, price, original_price, image, category, stock, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [name, description, price, original_price, image, category, stock, featured || false]
    );

    return res.status(201).json({
      status: 'success',
      product: newProduct.rows[0],
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update a product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      original_price,
      image,
      category,
      stock,
      featured,
    } = req.body;

    // Check if product exists
    const existingProduct = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    // Update product
    const updatedProduct = await query(
      `UPDATE products
      SET name = $1, description = $2, price = $3, original_price = $4,
          image = $5, category = $6, stock = $7, featured = $8,
          updated_at = NOW()
      WHERE id = $9
      RETURNING *`,
      [
        name,
        description,
        price,
        original_price,
        image,
        category,
        stock,
        featured,
        id,
      ]
    );

    return res.status(200).json({
      status: 'success',
      product: updatedProduct.rows[0],
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete a product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    // Delete product
    await query('DELETE FROM products WHERE id = $1', [id]);

    return res.status(204).send();
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await query(
      'SELECT * FROM products WHERE featured = true ORDER BY created_at DESC LIMIT 8'
    );

    return res.status(200).json({
      status: 'success',
      results: featuredProducts.rows.length,
      products: featuredProducts.rows,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get featured products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get product categories
export const getCategories = async (req, res) => {
  try {
    const categories = await query('SELECT DISTINCT category FROM products');

    return res.status(200).json({
      status: 'success',
      categories: categories.rows.map(row => row.category),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
