const Product = require('../models/productModel');

const ProductController = {
    getProducts: async (req, res) => {
        try {
            const { page, filters } = req.query;
            const perPage = 9;
            const skip = (page - 1) * perPage;

            if (!filters || filters === "All") {
                const count = await Product.countDocuments();
                const products = await Product.find().select("-__v")
                    .skip(skip)
                    .limit(perPage);

                return res.json({ products, total: count });
            }

            else {
                const count = await Product.countDocuments({ category: filters });
                const products = await Product.find({ category: filters }).select("-__v")
                    .skip(skip)
                    .limit(perPage);

                return res.json({ products, total: count });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getCategories: async (req, res) => {
        try {
            const categories = await Product.find().distinct('category');
            res.json(categories);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

module.exports = ProductController;
