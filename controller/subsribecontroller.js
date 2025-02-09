const jwt = require('jsonwebtoken');  
const getUserById = require('../utils/findUser');
const Signup = require('../model/signup');

const SECRET_KEY=process.env.secretkey
module.exports = {
  Subscribe: async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, unauthorized.' });
    }

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        const userId = decoded.id;
        try {
            const user = await getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Ensure user.subscribe exists
            if (!user.subscribe) {
                user.subscribe = [];
            }

            // Convert `productId` to a string and check properly
            const index = user.subscribe.findIndex(sub => sub.productId.toString() === productId.toString());

            let message;
            if (index === -1) {
                // If not present, add it
                user.subscribe.push({ productId });
                message = `User ${user.name} subscribed to product ${productId}`;
            } else {
                // If already present, remove it
                user.subscribe.splice(index, 1);
                message = `User ${user.name} unsubscribed from product ${productId}`;
            }

            // Save changes
            await user.save();

            res.status(200).json({ message });

        } catch (error) {
            console.error('Error fetching/updating user data:', error);
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
          
            if (user) {
              user.status = !user.status;
              console.log(user)
              await user.save();
            }
    
            return res.status(200).json({
                message: 'Subscription status updated successfully',
                status:user.status
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
      
