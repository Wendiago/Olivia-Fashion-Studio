const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        idGoogle: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserGoogle", userSchema);