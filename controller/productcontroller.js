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
    }
}