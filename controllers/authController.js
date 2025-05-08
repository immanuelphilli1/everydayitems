import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

// Generate access token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'testing', {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

// Generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'testing-refresh', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// Set token cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  // Access token cookie
  const accessTokenOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_ACCESS_COOKIE_EXPIRES_IN || '15') * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  };

  // Refresh token cookie
  const refreshTokenOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh',
  };

  res.cookie('accessToken', accessToken, accessTokenOptions);
  res.cookie('refreshToken', refreshToken, refreshTokenOptions);
};

// Validate password strength
const isPasswordStrong = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, phone, email, address, password } = req.body;

    console.log("field : ",password)

    // Validate input
    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address',
      });
    }

    // Validate password strength
    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters',
      });
    }

    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await query(
      'INSERT INTO users (name, phone_number, email, address, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, phone_number, email, address, role',
      [name, phone, email.toLowerCase(), address, hashedPassword, 'admin']
    );

    // Generate tokens
    const accessToken = generateAccessToken(newUser.rows[0].id);
    const refreshToken = generateRefreshToken(newUser.rows[0].id);

    // Store refresh token hash in database
    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash) VALUES ($1, $2)',
      [newUser.rows[0].id, await bcrypt.hash(refreshToken, 10)]
    );

    // Set token cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Return user data
    return res.status(201).json({
      status: 'success',
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

//guest register
export const registerGuest = async (body, res) => {
  try {
    const { name, phone, email, address, password } = body;

    console.log("field : ",password)

    // Validate input
    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await query(
      'INSERT INTO users (name, phone_number, email, address, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, phone_number, email, address, role',
      [name, phone, email.toLowerCase(), address, hashedPassword, 'admin']
    );

    // Generate tokens
    const accessToken = generateAccessToken(newUser.rows[0].id);
    const refreshToken = generateRefreshToken(newUser.rows[0].id);

    // Store refresh token hash in database
    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash) VALUES ($1, $2)',
      [newUser.rows[0].id, await bcrypt.hash(refreshToken, 10)]
    );

    // Set token cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Return user data
    return {
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (user.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.rows[0].id);
    const refreshToken = generateRefreshToken(user.rows[0].id);

    // Store refresh token hash in database
    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash) VALUES ($1, $2)',
      [user.rows[0].id, await bcrypt.hash(refreshToken, 10)]
    );

    // Set token cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Return user data
    return res.status(200).json({
      status: 'success',
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
        phone: user.rows[0].phone_number,
        address: user.rows[0].address,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Delete refresh token from database
      await query('DELETE FROM refresh_tokens WHERE token_hash = $1', [
        await bcrypt.hash(refreshToken, 10),
      ]);
    }

    // Clear cookies
    res.cookie('accessToken', 'logged_out', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.cookie('refreshToken', 'logged_out', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Logout failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Refresh access token
export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'No refresh token provided',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if refresh token exists in database
    const tokenExists = await query(
      'SELECT * FROM refresh_tokens WHERE user_id = $1 AND token_hash = $2',
      [decoded.id, await bcrypt.hash(refreshToken, 10)]
    );

    if (tokenExists.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    // Update refresh token in database
    await query(
      'UPDATE refresh_tokens SET token_hash = $1 WHERE user_id = $2 AND token_hash = $3',
      [await bcrypt.hash(newRefreshToken, 10), decoded.id, await bcrypt.hash(refreshToken, 10)]
    );

    // Set new token cookies
    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid refresh token',
    });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated. Please log in.',
      });
    }

    // Get fresh user data from database
    const user = await query(
      'SELECT id, name, email, role, address, phone_number as phone FROM users WHERE id = $1',
      [req.user.id]
    );

    console.log("user : ",user.rows[0])

    if (user.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      user: user.rows[0],
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
