const UserControllerAdmin = require("../../controllers/Admin/userController");
const middlewareController = require("../../controllers/middlewareController")
const router = require("express").Router();

// ADD USER
router.get("/",middlewareController.verifyTokenAndAdminAuth, UserControllerAdmin.getAllUser);

// GET USER BY ID
router.get("/:id",middlewareController.verifyTokenAndAdminAuth, UserControllerAdmin.getUserByID);

// UPDATE USER BY ID
router.post("/update/:id",middlewareController.verifyTokenAndAdminAuth, UserControllerAdmin.updateUser);

// DELETE USER BY ID
router.get("/delete/:id",middlewareController.verifyTokenAndAdminAuth, UserControllerAdmin.deleteUser);

module.exports = router;