const productControllerAdmin = require("../../controllers/Admin/productController");
const middlewareController = require("../../controllers/middlewareController")
const router = require("express").Router();

// ADD PRODUCT
router.post("/add",middlewareController.verifyTokenAndAdminAuth, productControllerAdmin.addProduct);

// UPDATE PRODUCT BY ID
router.post("/update/:id",middlewareController.verifyTokenAndAdminAuth, productControllerAdmin.updateProduct);

// DELETE PRODUCT BY ID
router.get("/delete/:id",middlewareController.verifyTokenAndAdminAuth, productControllerAdmin.deleteProduct);

module.exports = router;