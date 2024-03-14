const db = require('../models/UserGoogle')
const jwt = require("jsonwebtoken");

const loginSuccess = async (req, res) => {
    const { userId } = req?.body
    try {
        if (!userId) res.status(400).json({
            err: 1,
            msg: 'Missing inputs'
        })

        let response = await db.findOne({ idGoogle: userId });

        console.log(response);
        const token = jwt.sign(
            {
                id: response.id,
                isAdmin: response.isAdmin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "1d" }
        );

        //console.log(token);
        res.status(200).json({
            success: true,
            message: "Log in successfully !",
            user: response,
            jwt: token
        })

    } catch (error) {
        res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller ' + error
        })
    }
}

module.exports = {
    loginSuccess
}