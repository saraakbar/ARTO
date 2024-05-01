const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    img: {type: String, default: null},
    category: {type: String, required: true},
    product_type: {type: String, required: true},
    brand: {type: String, required: true},
    color: {type: Array, default: []},
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product