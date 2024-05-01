const express = require("express");
const router = express.Router();


/** import all controllers */
const controller = require('../controllers/appController.js');
const {registerMail } = require('../controllers/mailer.js');    
const { Auth,  localVariables } = require('../middleware/auth.js');


/** POST Methods */
router.post('/register', controller.register);                // register user
router.post('/registerMail', registerMail);            // send the email
router.post('/authenticate', controller.verifyUser, (req, res) => res.end());            // authenticate user
router.post('/login', controller.verifyUser, controller.login);                    // login in app     


/** GET Methods */
router.get('/user/:username', controller.getUser);                  // user with username
router.get('/generateOTP', controller.verifyUser , localVariables , controller.generateOTP);                    // generate random OTP
router.get('/verifyOTP', controller.verifyUser, controller.verifyOTP);                      //  verify generated OTP
router.get('/createResetSession', controller.createResetSession);             // reset all the variables


/** PUT Methods */
router.put('/updateuser', Auth , controller.updateUser);                // is use to update the user profile
router.put('/resetPassword', controller.verifyUser , controller.resetPassword);                 // use to reset password
 

module.exports = router;



/*
Different way to write Api (get,  post, put, patch, delete) :- 

1) router.post("/register", (req, res) => res.json('register route'));
-> first is path and second you can also include a callback function to send the response of request, you can also send
object in json format like :- 
EX :- router.post("/register", (req, res) => {
        res.json({
            success:true,
            message:'register route',
        });
    });

2) router.get("/student", auth, isStudent, (req,res) => {                      
    res.json({
        success:true,
        message:'Welcome to the Protected route for Students',
    });
});
-> in this first is path and then two middleware and then callback function;

3) router.post("/changepassword", auth, changePassword)   :- in this first path then middleware then controllers;

*/