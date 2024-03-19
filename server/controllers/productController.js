const Product = require('../models/productModel')

const ProductController = {
    getProducts: async (req, res) => {
        try {
            const products = await Product.find().select("-__v")
            res.json(products)
        } catch (error) {
            console.log(error)
            res.status(500).send("Something went wrong")
        }
    }
}

module.exports = ProductController