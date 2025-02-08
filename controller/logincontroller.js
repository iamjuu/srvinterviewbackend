const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Signup = require('../model/signup');

require('dotenv').config();
const SECRET_KEY = process.env.secretkey; // Ensure SECRET_KEY is defined in .env

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(SECRET_KEY); // Logs the SECRET_KEY to verify it's being read

      const user = await Signup.findOne({ email });
      if (!user) {
        return res.status(400).json({ status: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: false, message: 'Invalid password' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({
        status: true,
        message: 'Login successful',
        token, // Send token to frontend
        user: { id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  }
};
