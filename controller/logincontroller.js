const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Signup = require('../model/signup')
module.exports={
    login: async (req, res) => {
        try {
          const { email, password } = req.body;
    
          const user = await Signup.findOne({ email });
          if (!user) {
            return res.status(400).json({ status: false, message: 'User not found' });
          }
    
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ status: false, message: 'Invalid password' });
          }
    
          // Fix: Generate JWT token
          const token = jwt.sign({ id: user._id, email: user.email }, 'yourSecretKey', { expiresIn: '1h' });
    
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
}