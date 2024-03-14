const productController = require("../controllers/ProductController");
const middlewareController = require("../controllers/middlewareController");
const router = require("express").Router();

// GET ALL PRODUCTS
router.get("/search", middlewareController.verifyToken, productController.getAllProducts);

module.exports = router;