const productController = require("../controllers/ProductController");
const middlewareController = require("../controllers/middlewareController")
const router = require("express").Router();

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

// GET SIMILAR PRODUCTS
router.get("/similar/:id", productController.getSimilarProducts);

// GET PRODUCT BY ID
router.get("/:id", productController.getProductById);

// UPDATE PRODUCT BY ID
router.post("/update/:id",middlewareController.verifyToken, productController.updateProduct);

// GET ALL PRODUCTS IN CATEGORY
router.get("/category/:categoryId", productController.getAllProductInCate);

module.exports = router;