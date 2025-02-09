const Signup = require("../model/signup");
const product =require("./../model/product")
module.exports={
    productget: async (req, res) => {
        try {
          const products = await product.find(); // Fetch products from MongoDB
          res.status(200).json(products);
        } catch (error) {
          console.error('Error fetching products:', error);
          res.status(500).json({ message: 'Internal Server Error' })
        }
    },
    productDelete :async (req, res) => {
        try {
            const { id } = req.params;
            const deletedProduct = await product.findByIdAndDelete(id);
    
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' })
            }
    
            res.json({ message: 'Product deleted successfully' })
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Server error' })
        }
    },
    productEdit: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id);
            console.log(req.body);
            console.log('Received data:', {
                body: req.body,
                file: req.file,
                params: req.params
            });
            // Fetch the existing product first
            const existingProduct = await product.findById(id);
            if (!existingProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            // Prepare update data
            const updateData = { ...req.body };
            // If file exists, update imglink, otherwise keep the old one
            if (req.file) {
                updateData.imglink = req.file.filename; // Assuming filename is stored
            } else {
                updateData.imglink = existingProduct.imglink; // Keep existing link
            }
            console.log(updateData, 'Updated data');
            // Update product
            const updatedProduct = await product.findByIdAndUpdate(id, updateData, { new: true });
            res.json({ message: 'Product updated successfully', success: true });
            console.log('Updated');
    
        } catch (error) {
            console.error('Error editing product:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    // ************updated product*********************
    ,updatedproduct: async (req, res) => {
        try {
            // Get token from authorization header
            const token = req.headers.authorization.split(' ')[1];
            // Verify token and get user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;    
            // Find user's subscription data from signup collection
            const userData = await Signup.findById(userId);
            
            if (!userData) {
                return res.status(404).json({ message: 'User not found' });
            }   
            // Check if user has any subscribed products
            if (!userData.subscribe || !userData.subscribe.productId) {
                return res.json({ subscriptions: [] });
            }
    
            // Fetch full product details from products collection
            const subscribedProducts = await Product.find({
                _id: { $in: userData.subscribe.productId }
            });
    
            res.json({
                subscriptions: subscribedProducts
            });
    
        } catch (error) {
            console.error('Error in updatedproduct:', error);
            
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    Countproduct :(req, res) => {
        Signup.aggregate([
            { 
                $unwind: "$subscribe"  // Flatten the subscribe array
            },
            {
                $group: {
                    _id: null,  // Group by nothing to get a global count
                    count: { $sum: 1 }  // Increment count for each productId entry
                }
            }
        ])
        .then(result => {
            res.json({ count: result[0] ? result[0].count : 0 });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
    }

}