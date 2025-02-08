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
            const updateData = req.body;
            console.log(updateData,'egr');
            
    
            const updatedProduct = await product.findByIdAndUpdate(id, updateData, { new: true });
    
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            res.json({ message: 'Product updated successfully', updatedProduct });
            console.log('updated');
            
        } catch (error) {
            console.error('Error editing product:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    

}