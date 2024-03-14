const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
require('dotenv').config();
const db = require('./models/UserGoogle');
//const userController = require('./controllers/userController');

const axios = require("axios");
const https = require('https');
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Set this to false to ignore certificate errors
    }),
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://localhost:8000/api/auth/google/callback"
},
  async function (accessToken, refreshToken, profile, cb) {
    console.log(profile);
    const id = profile.id;
    try {
      const user = await db.findOne({idGoogle: id});      
      if (!user) {
        const newUser = new db({
          idGoogle: profile.id,
          username: profile.displayName,
          email: profile.emails[0]?.value,
        });
        await newUser.save();
         
        const userId = newUser.id;
        const response = await axiosInstance.post('https://localhost:5000/api/payment/create-account', {userId});
      }

      return cb(null, profile);
    } catch (err) {
      return cb(err);
    }
  }
));
