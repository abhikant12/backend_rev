import toast from 'react-hot-toast'
import { authenticate } from './helper'

/** validate login page username */
export async function usernameValidate(username){
    const errors = {};
    if(!username){
        errors.username = 'Username Required...!';
        return errors;
    }else if(username.includes(" ")){
        errors.username = 'Invalid Username...!';
        return errors;
    }

    if(username){
        const { status } = await authenticate(username);                  // check user exist or not
        if(status !== 200){
            errors.exist = 'User does not exist...!';
            return errors;
        }
    }
    return errors;
}   

/** validate password */
export async function passwordValidate(values){

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const errors = {};

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }
    return errors;
}

/** validate reset password */
export async function resetPasswordValidation(values){
    
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const errors = {};

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }

    if(values.password !== values.confirm_pwd){
        errors.exist = toast.error("Password not match...!");
    }

    return errors;
}

/** validate register form */
export async function registerValidation(values){

    const errors = {};
    if(!values.username){
        errors.username = toast.error('Username Required...!');
    }else if(values.username.includes(" ")){
        errors.username = toast.error('Invalid Username...!')
    }
    
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!values.password){
        errors.password = toast.error("Password Required...!");
    } else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password must be more than 4 characters long");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have special character");
    }

    if(!values.email){
        errors.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        errors.email = toast.error("Wrong Email...!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        errors.email = toast.error("Invalid email address...!")
    }
    return errors;
}

/** validate profile page */
export async function profileValidation(values){
    const errors = {};
    if(!values.email){
        errors.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        errors.email = toast.error("Wrong Email...!")
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        errors.email = toast.error("Invalid email address...!")
    }
    return errors;
}

 