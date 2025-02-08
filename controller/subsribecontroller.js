const jwt = require('jsonwebtoken');  
const getUserById = require('../utils/findUser');
const Signup = require('../model/signup');

const SECRET_KEY=process.env.secretkey
module.exports = {
    Subscribe: async (req, res) => {    
        const { productId } = req.body; 
        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
          return res.status(401).json({ message: 'No token provided, unauthorized.' });
        }
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
          }
          const decodedUserId = decoded.id;
          console.log(decodedUserId, 'decodedUserId');
          try {
            const user = await getUserById(decodedUserId);
            if (!user) {
              return res.status(404).json({ message: 'User not found.' });
            }
            console.log(`User ${user.name} (ID: ${decodedUserId}) subscribed to product ${productId}`);
            res.status(200).json({ message: `User ${user.username} subscribed to product ${productId}` });
          } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ message: 'Internal server error.' });
          }
        });
      },
      SubscribeToggle: async (req, res) => {
        try {
            // Check for authorization token
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token, authorization denied.' });
            }
    
            // Verify token and get userId
            const decoded = jwt.verify(token, SECRET_KEY);
            const userId = decoded.id;
    
            // Find user
            const user = await Signup.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
    
            // Check if user has any subscriptions
            if (!user.subscribe || user.subscribe.length === 0) {
                // Create first subscription with status true
                const updatedUser = await Signup.findByIdAndUpdate(
                    userId,
                    { $push: { subscribe: { status: true } } },
                    { new: true }
                );
                return res.status(200).json({
                    message: 'Subscription created successfully',
                    status: true
                });
            }
    
            // Toggle existing subscription status
            const currentStatus = user.subscribe[0].status;
            const updatedUser = await Signup.findByIdAndUpdate(
                userId,
                { $set: { 'subscribe.0.status': !currentStatus } },
                { new: true }
            );
    
            return res.status(200).json({
                message: 'Subscription status updated successfully',
                status: updatedUser.subscribe[0].status
            });
    
        } catch (err) {
            console.error('Subscribe toggle error:', err);
            return res.status(500).json({ 
                message: 'Server error',
                error: err.message 
            });
        }
    }
    }
      
