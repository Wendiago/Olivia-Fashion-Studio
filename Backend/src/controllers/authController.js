const User = require("../models/User");
const Account = require("../models/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const axiosInstance = require("axios");
const https = require("https");
// const axiosInstance = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false, // Set this to false to ignore certificate errors
//   }),
// });

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const testUser = await User.findOne({ username: req.body.username });
      const testEmail = await User.findOne({ email: req.body.email });

      if (testUser !== null) {
        return res.status(401).json({
          success: false,
          message: "Username is duplicated!",
          data: {},
        });
      }

      if (testEmail !== null) {
        return res.status(403).json({
          success: false,
          message: "Email is duplicated!",
          data: {},
        });
      }

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        password: hashed,
      });

      //Save user to DB
      const user = await newUser.save();

      const userId = newUser.id;
      const response = await axiosInstance.post(
        "http://localhost:5000/api/payment/create-account",
        { userId }
      );

      return res.status(200).json({
        success: true,
        message: "Register successfully !",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
        data: {},
      });
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Incorrect username",
          data: {},
        });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(404).json({
          success: false,
          message: "Incorrect password",
          data: {},
        });
      }

      if (user && validPassword) {
        //Generate access token
        const accessToken = await authController.generateAccessToken(user);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = user._doc;

        return res.status(200).json({
          success: true,
          message: "Log in successfully !",
          data: { ...others, accessToken },
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: {},
      });
    }
  },

  //LOG OUT
  logOut: async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  },

  //UPDATE USER
  updateUser: async (req, res) => {
    try {
      const updateUser = {
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
      };

      // Update the user using findByIdAndUpdate
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateUser,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          data: {},
        });
      }

      res.status(200).json({
        success: true,
        message: "Edit successfully!",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: {},
      });
    }
  },
};

module.exports = authController;
