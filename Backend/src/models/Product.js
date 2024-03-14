var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
        id_category: {
            type: String,
            ref: 'Category'
        },
        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }
);

var Products = mongoose.model('Product', schema, 'product');

module.exports = Products;