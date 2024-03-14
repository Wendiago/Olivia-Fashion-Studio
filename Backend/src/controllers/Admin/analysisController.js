const moment = require('moment');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');

const analysisController = {

    getTopSellingProducts: async (req, res) => {
        try {
            const topSellingProducts = await Order.aggregate([
                { $unwind: '$items' },
                {
                    $group: {
                        _id: '$items.product',
                        total: { $sum: '$items.quantity' }
                    }
                },
                {
                    $lookup: {
                        from: Product.collection.name,
                        localField: '_id',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $unwind: '$product'
                },
                {
                    $sort: { total: -1 }
                },
                {
                    $limit: 5
                }
            ]);
            if (!topSellingProducts) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Get Top Selling Products successfully !',
                data: topSellingProducts
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error,
                data: {}
            });
        }
    },

    getOrderCount: async (req, res) => {
        try {
            const orderCount = await Order.countDocuments();
            //const orderCount = await Order.countDocuments((count) => count);

            if (!orderCount) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Get Order Count successfully !',
                data: orderCount
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error,
                data: {}
            });
        }
    },

    getTotalRevenue: async (req, res) => {
        try {
            const totalRevenue = await Order.aggregate([
                { $match: { status: 'COMPLETED' } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]);

            res.status(200).json({ 
                success: true,
                message: 'Get Total Revenue successfully !',
                totalRevenue: totalRevenue[0].total });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: error.message
            });
        }
    },
    
    getDailyRevenue: async (req, res) => {
        try {
            const startDate = moment().startOf('week');
            const endDate = moment().endOf('week');          
            const dailyRevenue = await Order.aggregate([
                {
                    $match: {
                        status: 'COMPLETED',
                        createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%d-%m-%Y', date: '$createdAt' } },
                        total: { $sum: '$totalPrice' }
                    }
                }
            ]);
    
            if (dailyRevenue.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No completed orders found within the specified week',
                    data: {}
                });
            }
    
            return res.status(200).json({
                success: true,
                message: 'Get Daily Revenue successfully!',
                data: dailyRevenue
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: {}
            });
        }
    },
    
    getWeeklyRevenue : async (req, res) => {
        try {
            const startDate = moment().startOf('month');
            const endDate = moment().endOf('month');   

            const weeklyRevenue = await Order.aggregate([
                { $match: { 
                    status: 'COMPLETED',
                    createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } 
                    }
                 },
                { $group: { _id: { $dateToString: { format: '%Y-%U', date: '$createdAt' } }, total: { $sum: '$totalPrice' } } }
            ]);
            if (!weeklyRevenue) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Get Weekly Revenue successfully !',
                data: weeklyRevenue
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: err,
                data: {}
            });
        }
    },

    getMonthlyRevenue : async (req, res) => {
        try {
            const startDate = moment().startOf('year');
            const endDate = moment().endOf('year');   
            const monthlyRevenue = await Order.aggregate([
                { $match: {
                     status: 'COMPLETED',
                     createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
                    } 
                },
                { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$totalPrice' } } }
            ]);
            if (!monthlyRevenue) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Get Monthly Revenue successfully !',
                data: monthlyRevenue
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error,
                data: {}
            });
        }
    },

    getYearlyRevenue : async (req, res) => {
        try {
            const monthlyRevenue = await Order.aggregate([
                { $match: { status: 'COMPLETED' } },
                { $group: { _id: { $dateToString: { format: '%Y', date: '$createdAt' } }, total: { $sum: '$totalPrice' } } }
            ]);
            if (!monthlyRevenue) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                    data: {}
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Get Yearly Revenue successfully !',
                data: monthlyRevenue
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error,
                data: {}
            });
        }
    },
};

module.exports = analysisController;