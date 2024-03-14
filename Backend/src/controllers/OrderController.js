const Order = require("../models/Order");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const token = req.headers.token;
      const accessToken = token.split(" ")[1];
      const decodedToken = jwt.decode(accessToken);

      const newOrder = await Order.create({
        ...req.body,
        user: decodedToken.id,
      });

      const orderItems = newOrder.items;
      orderItems.forEach(async (item) => {
        const product = await Product.findById(item.product);
        product.quantity -= item.quantity;
        await product.save();
      });

      //const id_product = req.body.items.product;
      res.status(200).json({
        success: true,
        message: "Create order successfully!",
        data: newOrder,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: [],
      });
    }
  },

  getAllOrder: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const offset = (page - 1) * limit;

      const orders = await Order.find()
        .skip(offset)
        .limit(limit)
        .populate("user", "fullname username email")
        .populate("items.product", "name price");

      const totalOrders = await Order.countDocuments();

      res.status(200).json({
        success: true,
        message: "Get all orders successfully!",
        totalPages: Math.ceil(totalOrders / limit),
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: [],
      });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
          data: {},
        });
      }

      res.status(200).json({
        success: true,
        message: "Get order successfully!",
        data: order,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const updateData = req.body;

      // Validate if the order exists
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
          data: {},
        });
      }

      // Update the order with the new data
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Update order successfully!",
        data: updatedOrder,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        data: {},
      });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
          data: {},
        });
      }

      res.status(200).json({
        success: true,
        message: "Delete order successfully!",
        data: deletedOrder,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  },

  // get orders by user id
  getOrdersByUserId: async (req, res) => {
    try {
      const userId = req.params.id;
      const orders = await Order.find({ user: userId }).populate({
        path: "items.product",
        model: "Product",
      });

      res.status(200).json({
        success: true,
        message: "Get orders successfully!",
        data: orders,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
        data: [],
      });
    }
  },
};

module.exports = orderController;
