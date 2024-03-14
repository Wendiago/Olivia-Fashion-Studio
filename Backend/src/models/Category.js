var mongoose = require('mongoose');

var schema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
            required: true
        }
    }
);

var Category = mongoose.model('Category', schema, 'category');

module.exports = Category;