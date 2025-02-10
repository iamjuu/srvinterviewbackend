const Signup = require("../model/signup");
const product = require("./../model/product");
const SECRET_KEY=process.env.secretkey
const jwt = require('jsonwebtoken');  

module.exports = {
  productget: async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
console.log(token,'dgdf');

        if (!token) {
            return res.status(401).json({ message: 'No token provided, unauthorized.' });
        }

      
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid or expired token.' });
            }

            try {
                const userId = decoded.id;  
                
              
                const products = await product.find();

                const user = await Signup.findById(userId).populate({
                    path: 'subscribe.productId', 
                    model: 'product',            
                });

                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }

             
                const subscribedProducts = user.subscribe.map(sub => sub.productId);

                res.status(200).json({
                    products,             
                    subscribedProducts    
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
console.log(id);

    
      const productToDelete = await product.findById(id);

      if (!productToDelete) {
        return res.status(404).json({ message: "Product not found" });
      }

    
      await product.findByIdAndDelete(id);


      const user = await Signup.findOne();
      user.notification.push({
        message: `New product added: ${productToDelete.name}`,
        product:productToDelete._id
      });

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
