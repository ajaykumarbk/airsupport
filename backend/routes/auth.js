/**
 * Authentication Routes
 * Handles user registration, login, and token refresh
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { getPool } = require('../database');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, username, firstName, lastName }
 */
router.post('/register', async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  // Validation
  if (!email || !password || password.length < 6) {
    return res.status(400).json({
      error: 'Email and password (min 6 chars) are required',
    });
  }

  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    // Check if user already exists
    const [rows] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (rows.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'Email or username already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await connection.query(
      `INSERT INTO users (email, password_hash, username, first_name, last_name) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, passwordHash, username || null, firstName || null, lastName || null]
    );

    const userId = result.insertId;

    // Generate token
    const token = generateToken(userId, email);

    connection.release();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        username: username || null,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });
  } catch (error) {
    console.error('[Auth] Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user with email and password
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    // Find user
    const [rows] = await connection.query(
      'SELECT id, email, password_hash, username, first_name, last_name FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await connection.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id, user.email);

    connection.release();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current user information (requires authentication)
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT id, email, username, first_name, last_name, is_active, created_at, last_login FROM users WHERE id = ?',
      [req.user.userId]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.is_active,
        createdAt: user.created_at,
        lastLogin: user.last_login,
      },
    });
  } catch (error) {
    console.error('[Auth] Get me error:', error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

/**
 * POST /api/auth/change-password
 * Change password for authenticated user
 * Body: { currentPassword, newPassword }
 */
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    // Get user's current password hash
    const [rows] = await connection.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, rows[0].password_hash);

    if (!isPasswordValid) {
      connection.release();
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await connection.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, req.user.userId]
    );

    connection.release();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('[Auth] Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

module.exports = router;
