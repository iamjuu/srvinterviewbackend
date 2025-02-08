const jwt = require('jsonwebtoken');  
const getUserById = require('../utils/findUser');

const SECRET_KEY=process.env.secretkey
module.exports = {
    Subscribe: async (req, res) => {    
        const { productId } = req.body; 
      
        // Get the token from the authorization header
        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
          return res.status(401).json({ message: 'No token provided, unauthorized.' });
        }
      
        // Verify the token and extract the user ID
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
          }
      
          const decodedUserId = decoded.id;
          console.log(decodedUserId, 'decodedUserId'); // Logging the decoded user ID
      
          try {
            // Fetch the user from the database using the decoded user ID
            const user = await getUserById(decodedUserId);
            if (!user) {
              return res.status(404).json({ message: 'User not found.' });
            }
      
            // Perform the subscription logic here (e.g., add product to the user's subscriptions)
            console.log(`User ${user.name} (ID: ${decodedUserId}) subscribed to product ${productId}`);
            
            // Respond with success message
            res.status(200).json({ message: `User ${user.username} subscribed to product ${productId}` });
          } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ message: 'Internal server error.' });
          }
        });
      }
      
};
