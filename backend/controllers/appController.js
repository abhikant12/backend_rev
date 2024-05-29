const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
require("dotenv").config();


/** middleware for verify user */                 // if there is valid username then only we check for password in login controller;
const verifyUser = async(req, res, next) => {
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await User.findOne({ username });
        if(!exist){
                return res.status(400). json({
                    success:false,
                    message:"Can't find User!",
                });
            }
        next();
    } catch (error) {
        return res.status(404).json({
            success : false,
            message : "Authentication Error"
        });
    }
}



/** POST: http://localhost:4000/api/register 
      {
  "username" : "example123",
  "password" : "admin123",
  "email":  "example@gmail.com",
  "profile": "abhi.png"
}
*/
const register = async(req , res) => {
      try{
        
        const { username, password, profile, email } = req.body;      
        
        console.log("in register controller");

        if(!username || !password || !email || !profile){
             return res.status(403).json({
                success : false,
                message : "All fields are required",
             })
        }

        const existingemail = await User.findOne({email});                   //check user already exist or not
        const existingusername = await User.findOne({username}); 

        if(existingemail || existingusername){
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);             //Hashed the password

         //created entry in User in DB
        const user = await User.create({
            username,
            password : hashedPassword,
            email,
            profile
        })
  
        return res.status(200).json({                                         //return res
            success:true,
            user,
            message:'User is registered Successfully',
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registrered. Please try again",
        })
      }
}


/** POST: http://localhost:4000/api/login 
    {
  "username" : "example123",
  "password" : "admin123"
}
*/
const login = async(req , res) => {
    try {
        const {username, password} = req.body;                  
      
        if(!username || !password){                              
            return res.status(403). json({
                success:false,
                message:'Please Fill up All the Required Fields',
            });
        }
        
        var user = await User.findOne({username});          //user check exist or not
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registrered, please signup first",
            });
        }

        console.log(user);
        
        if(await bcrypt.compare(password, user.password)){                    
            const payload = {                                                   // made Payload for JWT TOKEN;            
                username: user.username,
                id: user._id,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {         // generate JWT TOKEN (combination of header , payload , signature) 
                expiresIn:"20h",                                              // set expiry time;
            });
            
            user = user.toObject();                                            // converted user into object, if we not convert user into object then it does not display token;
            user.token = token;                                                // insert token in user object , before insert make user object otherwise token cannot inserted;
            user.password = undefined;                                         // erase password so noone can see password from token;   

            console.log(user);

            // const options = {                                                  //create cookie and send response
            //     expires: new Date(Date.now() + 12*3600000),                     / Cookie expires in 12 hour
            //     httpOnly:true,                                                 // Cookie accessible only via HTTP requests
            // }
            // return res.cookie("token", token, options).status(200).json({            // made a cookie(name, value, options) and send it in response
            //     success:true,                                                 // also send a json msg containg token, user object, msg; 
            //     user,
            //     message:'Logged in successfully',
            // });

            res.cookie('token', token, {
                expires: new Date(Date.now() + 12*3600000),                              // Cookie expires in 12 hour
                httpOnly: true,                                                         // Cookie accessible only via HTTP requests
                sameSite: 'strict'                                                      // Protect against CSRF attacks
            });

            return res.status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successfully'
            });


      }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
};


/** GET: http://localhost:4000/api/user/example123 */
const getUser = async(req , res) => {
    try {
        const { username } = req.params;                        // what is req.params ?
    
        if(!username){
            return res.status(403). json({
                success:false,
                message:'Invalid Username',
            });
        }
       
        var user = await User.findOne({username});                                //user check exist or not
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registrered, please signup first",
            });
        }

        // remove password from user and  mongoose return unnecessary data with object so convert it into json
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(200).json({                                         //return res
            success:true,
            rest,
            message:'User data find successfully',
        });
    }  catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot Find User Data",
        });
    }
}


/*explained how the updateUser route is working;      

The route of updateUser is :- router.put('/updateuser', Auth , controller.updateUser); 
first Auth execute which is a middleWare :- 
const Auth = async(req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];                        // access authorize header to validate request
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);         // verify the token;
        req.user = decodedToken;                                                     // retrive the user details for the logged in user
        next()
    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
}

in this Auth middleWare we fetch the token that are provided in request and then verify the token and then fetch the user details from token which are 
provide in payload of token at the time of logged in.  and save it in "req.user" and then next() so that controller.updateUser execute 
and in controller.updateUser we fetched the userId by "const userId = req.user.id;"

Here the work of middleware is to verify the user using token and then fetch the user_Id form token and saved it in user_Id and then passed the function
to controller.updateUser and then this function we update the data using user_id which was saved by middleware;

PUT: http://localhost:4000/api/updateuser                       
  Auth : Bearer { paste the Token }
  body: {
        firstName: '',
        address : '',
        profile : ''
    }
*/
const updateUser = async(req , res) => {
    try {

        const {firstName,  lastName, address,  mobile,  profile,  email, } = req.body
        const userId = req.user.id;                                             //fetch user_id form req.user;
    
        if(userId){
            const userDetails = await User.findById(userId);                   // find userDetails from DB using userId;

             if(firstName) userDetails.firstName = firstName;
             if(lastName) userDetails.lastName = lastName;
             if(email) userDetails.email = email;
             if(address) userDetails.address = address;
             if(mobile) userDetails.mobile = mobile;
             if(profile) userDetails.profile = profile;

             await userDetails.save();                                            // Save the updated data

             const updatedUserDetails = await User.findById(userId);               // find updated details;

             return res.json({
                success: true,
                message: "Profile updated successfully",
                updatedUserDetails,
              });
        }
        else{
            return res.status(403). json({
                success:false,
                message:'User not found',
            });
        }
       
    }  catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot Find User Data",
        });
    }
}


// router.get('/generateOTP', controller.verifyUser , localVariables , controller.generateOTP);   
/** GET: http://localhost:4000/api/generateOTP */
const generateOTP = async(req, res) => {
    try {

        req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        res.status(201).json({
            success : true,
            code : req.app.locals.OTP,
           message : "OTP generated successfully!"
        })

    }  catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot generated OTP",
        });
    }
}


/** GET: http://localhost:4000/api/verifyOTP */
const verifyOTP = async(req, res) => {

    const { code } = req.query;                                               // how ?
    if(parseInt(req.app.locals.OTP) === parseInt(code)){

        req.app.locals.OTP = null;                                            // reset the OTP value
        req.app.locals.resetSession = true;                                   // start session for reset password
        
        return res.status(201).json({                                         //return res
            success:true,
            message:'Verify Successsfully!',
        });
        
    }
    return res.status(400).json({
        success:false,
        message:"Invalid OTP"
    });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:4000/api/createResetSession */
const createResetSession = async(req, res) => {

    if(req.app.locals.resetSession){
        return res.status(201).json({
            success : true,
            flag : req.app.locals.resetSession
        })
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:4000/api/resetPassword */
const resetPassword = async(req, res) => {
    try {
        
        if(!req.app.locals.resetSession){
                return res.status(440).json({
                    success : false,
                    message : "Session expired!"
                });
        }

        const { username, password } = req.body;
        if(!username || !password){
            return res.status(404).json({
                success : false,
                message : "Please enter all the field"
            });
        }

        const userDetails = await User.findOne({ username });
        if(!userDetails){
            return res.status(404).json({
                success : false,
                message : "User Not Found!"
            });
        }
         const hashedPassword = await bcrypt.hash(password, 10);
         userDetails.password = hashedPassword;
         await userDetails.save();                                        //save the updated user details
         req.app.locals.resetSession = false; 

         return res.status(201).json({
            success : true,
            message : "password reset successfully"
         });

    } catch (error) {
        return res.status(401).json({
            success : false,
            message : "please try again!"
        });
    }
}


module.exports =  {register , login ,getUser, updateUser ,generateOTP, verifyOTP , createResetSession, resetPassword, verifyUser};