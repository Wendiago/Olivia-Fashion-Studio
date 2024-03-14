const mongoose = require('mongoose');
//const moment = require('moment');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING',
    },
}, { timestamps: true });

// orderSchema.set('toJSON', {
//     transform: (doc, ret) => {
//         ret.date = moment(ret.date).format('HH:mm:ss DD/MM/YYYY');
//         return ret;
//     },
// });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;