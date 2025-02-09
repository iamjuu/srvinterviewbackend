// controllers/notification.js
const getUserById = require('../utils/findUser');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.secretkey; // Replace with a secure key
const Signup = require('../model/signup'); // Adjust the path to your model

module.exports = {
    // ***********notification path ***************
    Notification: async (req, res) => {
        console.log('Fetching notifications and subscriptions');

        try {
            // Get token from Authorization header
            const token = req.headers['authorization']?.split(' ')[1];
            console.log(token );
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No token provided, unauthorized.'
                });
            }
            // Verify token and get user ID
            const decoded = jwt.verify(token, SECRET_KEY);
            const userId = decoded.id;
console.log(userId,'userdidd');
            const userData = await Signup.findById(userId)
                .populate({
                    path: 'subscribe.productId', 
                    select: '_id name price description' 
                })
                .select('subscribe notification'); 

            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Return both subscription and notification details
            return res.status(200).json({
                success: true,
                message: 'Notifications and subscriptions retrieved successfully.',
                data: userData
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error, unable to process request.',
                error: error.message
            });
        }
    }
};
