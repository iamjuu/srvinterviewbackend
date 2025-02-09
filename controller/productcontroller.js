const Signup = require("../model/signup");
const product = require("./../model/product");
const SECRET_KEY=process.env.secretkey
const jwt = require('jsonwebtoken');  

module.exports = {
  productget: async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided, unauthorized.' });
        }

        // Use promisify to handle jwt.verify with async/await
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token.' });
            }

            try {
                const userId = decoded.id;  // Now decoded is available in this scope
                
                // Fetch all products
                const products = await product.find();

                // Fetch the user and populate the subscribe array with product details
                const user = await Signup.findById(userId).populate({
                    path: 'subscribe.productId', // Populate the productId field in subscribe
                    model: 'product',            // Reference to the 'product' model
                });

                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }

                // Get the subscribed products for the user
                const subscribedProducts = user.subscribe.map(sub => sub.productId);

                // Send both the full list of products and the subscribed products
                res.status(200).json({
                    products,             // All products
                    subscribedProducts    // Products user is subscribed to
                });

            } catch (error) {
                console.error("Error fetching products:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
},



  productDelete: async (req, res) => {
    try {
      const { id } = req.params;

      // Find the product by its ID
      const productToDelete = await product.findById(id);

      if (!productToDelete) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete the product after finding it
      await product.findByIdAndDelete(id);

      // Add notification for the user
      const user = await Signup.findOne();
      user.notification.push({
        message: `New product added: ${name}`,
        product:productToDelete._id
      });

      // Save the user data after updating the notification
      await user.save();

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  productEdit: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      console.log(req.body);
      console.log("Received data:", {
        body: req.body,
        file: req.file,
        params: req.params,
      });

    
      const existingProduct = await product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const updateData = { ...req.body };
      if (req.file) {
        updateData.imglink = req.file.filename; 
      } else {
        updateData.imglink = existingProduct.imglink; 
      }

      console.log(updateData, "Updated data");

      // Update the product
      const updatedProduct = await product.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      const user = await Signup.findOne();
      if (user) {
        user.notification.push({
          message: `Product Edited: ${updatedProduct.name}`,
          product:existingProduct._id
        });
        await user.save();
      }

      res.json({ message: "Product updated successfully", success: true });
      console.log("Product updated");
    } catch (error) {
      console.error("Error editing product:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // ************updated product*********************
  updatedproduct: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      const userData = await Signup.findById(userId);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!userData.subscribe || !userData.subscribe.productId) {
        return res.json({ subscriptions: [] });
      }
      const subscribedProducts = await Product.find({
        _id: { $in: userData.subscribe.productId },
      });
      userData.notification.push({
        message: "Your subscriptions have been updated.",
      });
      await userData.save();
      res.json({
        subscriptions: subscribedProducts,
      });
    } catch (error) {
      console.error("Error in updatedproduct:", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  },
// ********** count ********
  Countnotification: (req, res) => {
    Signup.aggregate([
      {
        $unwind: "$notification",
      },
      {
        $group: {
          _id: null, 
          count: { $sum: 1 }, 
        },
      },
    ])
      .then((result) => {
        res.json({ count: result[0] ? result[0].count : 0 });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  },
  
};
