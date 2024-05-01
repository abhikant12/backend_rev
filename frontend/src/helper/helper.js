import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;


/** Make API Requests */


/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/** get User details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}

/** register user function */
export async function registerUser(credentials){
    try {
        const response = await axios.post(`/api/register`, credentials);
        const { success, message } = response.data;

        let { username, email } = credentials;

        if(success){
            const text = `Hello ${username}. You have registered Successfully`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Registration"})
        }

        return { success, message };
    } catch (error) {
        throw { error };
    }
}

/** login function */
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data, headers } = await axios.post('/api/login', { username, password });
            // here headers contain cookie and cookie contain token and data contain (success, token, user, message);
            return { data };
        }
    } catch (error) {
        throw { error: "Password doesn't Match...!" };
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
         const token = localStorage.getItem('token');
         const data = await axios.put('/api/updateuser', response, { headers : { "authorization" : `Bearer ${token}`}});
         return { data };
    } catch (error) {
        throw { error : "Couldn't Update Profile...!"};
    }
}

/** generate OTP */ 
export async function generateOTP(username){
    try {
        const response = await axios.get('/api/generateOTP', { params : { username }});
        const { code, message , success} = response.data;
          
        // send mail with the OTP
        if(success){
            const userDataResponse = await getUser({ username });
            const {rest, message} = userDataResponse.data;
            const email = rest.email;
            const text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
        }
        return code;
    } catch (error) {
        throw { error };
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
       const { data } = await axios.get('/api/verifyOTP', { params : { username, code }})
       const { success , message} = data;

       return { success , message }
    } catch (error) {
        throw { error };
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data } = await axios.put('/api/resetPassword', { username, password });
        const {success, message} = data;

        return { success, message };
    } catch (error) {
        throw { error };
    }
}