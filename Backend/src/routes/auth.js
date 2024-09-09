const router = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const authGoogleController = require("../controllers/googleController");
const middlewareController = require("../controllers/middlewareController");

// api/auth

//REGISTER
router.post("/register", authController.registerUser);

//LOG IN
router.post("/login", authController.loginUser);

//LOG OUT
router.post("/logout", middlewareController.verifyToken, authController.logOut);

//UPDATE PROFILE
router.post(
  "/update/:id",
  middlewareController.verifyToken,
  authController.updateUser
);

//GET INFO
router.get(
  "/info",
  middlewareController.verifyToken,
  authController.getUserInfo
);

//
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`http://localhost:5173/login-success/${req.user?.id}`);
  }
);

router.post("/login-success", authGoogleController.loginSuccess);

module.exports = router;
