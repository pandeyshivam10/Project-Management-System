const jwt = require('jsonwebtoken');
const { createUser, checkUser } = require('./user');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Use Case: Register a new user
 * Validations:
 * 1. Email format check
 * 2. Password length (min 8 chars)
 * 3. Name is required
 * 4. Role must be 'Admin' or 'Client'
 */
const signup = async (req, res) => {
  try {
    const { username, password, role, name } = req.body;
    
    // Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    // Simple password check (e.g., min 8 chars)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (!name) {
       return res.status(400).json({ message: 'Name is required' });
    }
    
    if (role && !['Admin', 'Client'].includes(role)) {
       return res.status(400).json({ message: 'Invalid role' });
    }

    const newUser = await createUser(username, password, role, name);
    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Use Case: Authenticate existing user
 * Logic: Verifies credentials and issues a JWT token valid for 8 hours.
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await checkUser(username, password);
    
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.status(200).json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signup, login };
