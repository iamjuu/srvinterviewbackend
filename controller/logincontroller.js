const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Signup = require('../model/signup');

require('dotenv').config();
const SECRET_KEY = process.env.secretkey; 

module.exports = {
  // ***********login path****************
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(SECRET_KEY);
  
      const user = await Signup.findOne({ email });
      if (!user) {
        return res.status(400).json({ 
          status: false, 
          message: 'User not found' 
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ 
          status: false, 
          message: 'Invalid password' 
        });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
      );
      const userData = {
        _id: user._id,
        email: user.email,
        status:user.status 
       
      };
  
      res.status(200).json({
        status: true,
        message: 'Login successful',
        token,
        user: userData
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        status: false, 
        message: 'Internal server error' 
      });
    }
  }
};
