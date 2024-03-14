const Product = require('../../models/Product');

const productController = {   
    addProduct: async (req, res) => {
        try {
            const product = await Product.findOne({ name: req.body.name })

            if(product){
                return res.status(404).json({
                    success: false,
                    message: "product already exists"
                })
            }
    
            const newProduct = await new Product({
                name: req.body.name,
                id_category: req.body.id_category,
                price: req.body.price,
                image: req.body.image,
                description: req.body.description,
                quantity: req.body.quantity,
            });
    
            const createProduct = await newProduct.save();
    
            return res.status(200).json({
                success: true,
                message: 'Add Product successfully !',
                data: createProduct
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: err,
                data: {}
            });
        }
    },

    updateProduct: async (req, res) => {
        try {    
            const updateProduct = {
                name: req.body.name,
                id_category: req.body.id_category,
                price: req.body.price,
                image: req.body.image,
                description: req.body.description,
                quantity: req.body.quantity,
            };
    
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateProduct, { new: true });
    
            if (!updatedProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Edit Product successfully !',
                data: updatedProduct
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: err,
                data: {}
            });
        }
    },

    deleteProduct: async (req , res) => {
        try {
            await Product.deleteOne({_id: req.params.id})
            res.status(200).json({
                success: true,
                message: 'Delete successfully!',
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err,
                data: {}
            });
        }
    }
}

module.exports = productController;