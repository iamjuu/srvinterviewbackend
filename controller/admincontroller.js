const product = require('../model/product');
const Signup = require('../model/signup'); // Add this line to import the Signup model

module.exports = {
  formPost: async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.file);
      
      const { name, price } = req.body;
      const filename = req.file.filename;
      console.log(filename);

      // Create and save the new product
      const newProduct = new product({
        name,
        price,
        imglink: filename,
      });

      await newProduct.save();

      // Find a user and update their notifications
      const user = await Signup.findOne();
      user.notification.push({
        message: `New product added: ${name}`,
        product:newProduct._id
      });
console.log(user);

      await user.save();

      res.status(200).json({ message: "Product added and notification sent!" });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Error adding product", error: error.message });
    }
  }
};