import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check access token in cookies first
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Then check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated. Please log in.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const currentUser = await query(
        'SELECT id, email, name, role FROM users WHERE id = $1',
        [decoded.id]
      );

      if (currentUser.rows.length === 0) {
        return res.status(401).json({
          status: 'error',
          message: 'User no longer exists.'
        });
      }

      // Grant access to protected route
      req.user = currentUser.rows[0];
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token expired. Please refresh your token.'
        });
      }

      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated. Please log in.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action.'
      });
    }

    next();
  };
};
