const jwt = require("jsonwebtoken");
require("dotenv").config();


/** auth middleware */
const Auth = async(req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];                      // access authorize header to validate request
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);               // verify the token;
        req.user = decodedToken;                                                   // retrive the user details for the logged in user

        next()

    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
}


const localVariables =  (req, res, next) => {
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
};


module.exports = {Auth, localVariables};