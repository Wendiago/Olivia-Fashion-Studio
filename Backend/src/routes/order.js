const orderController = require("../controllers/OrderController");
const middlewareController = require("../controllers/middlewareController");
const router = require("express").Router();



router.post("/create", middlewareController.verifyToken, (req, res) => {
    orderController.createOrder(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// GET ALL ORDER
router.get("/", middlewareController.verifyToken, (req, res) => {
    orderController.getAllOrder(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// GET ORDER BY ID
router.get("/:id", middlewareController.verifyToken, (req, res) => {
    orderController.getOrderById(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// UPDATE ORDER BY ID
router.post("/update/:id", middlewareController.verifyTokenAndAdminAuth, (req, res) => {
    orderController.updateOrder(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// DELETE ORDER BY ID
router.get("/delete/:id", middlewareController.verifyTokenAndAdminAuth, (req, res) => {
    orderController.deleteOrder(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

// GET ORDERS BY USER ID
router.get("/user/:id", middlewareController.verifyToken, (req, res) => {
    orderController.getOrdersByUserId(req, res).catch((error) => {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: [],
        });
    });
});

module.exports = router;
