import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import { verifyPassword } from '../helper/helper';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';


export default function Password(){

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if(!password) toast.error("Password Required...!");
    else if(password.includes(" ")) toast.error("Wrong Password...!");
    else if(password.length < 4) toast.error("Password must be more than 4 characters long");
    else if(!specialCharacterRegex.test(password)) toast.error("Password must have special character");
    else{
            // Verify password
            try {
              const { data } = await verifyPassword({ username, password });
              const { user, message, token } = data;

              console.log(token);
              localStorage.setItem('token', token);
              console.log(message);                           // Logged in successfully
              navigate('/profile');
            } catch (error) {
              toast.error(<b>Password Not Match!</b>);
            }
       }
  };



  if(isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'> Explore More by connecting with us. </span>
          </div>
         
          <form className='py-1' onSubmit={handleSubmit}>
            
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
            </div>
           
            <div className="textbox flex flex-col items-center gap-6">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.textbox}
                type="password"
                placeholder='Password'
              />
              <button className={styles.btn} type='submit'>Sign In</button>
            </div>
            <div className="text-center py-4">
              <span className='text-gray-500'>
                Forgot Password?
                <Link className='text-red-500' to="/recovery"> Recover Now </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




/*
specialCharacterRegex: This regular expression matches any of the special characters: !@#$%^&*(),.?":{}|<>.
test method: The test method of a regular expression checks if the string (password in this case) contains at least one character that matches the pattern defined by the regular expression.



import { useFormik } from 'formik';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import { verifyPassword } from '../helper/helper';
import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';

export default function Password(){

  const navigate = useNavigate();
  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
 
  const formik = useFormik({
    initialValues: {
        password: 'abhi@12'
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
        try {
            const { data } = await verifyPassword({ username, password: values.password });
             
            let { user, message , token } = data;

            console.log(token);
            localStorage.setItem('token', token);
            console.log(message);                               // Logged in successfully
            navigate('/profile');
        } catch (error) {
            toast.error(<b>Password Not Match!</b>);
        }
    }
});

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'> Explore More by connecting with us. </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password' />
                  <button className={styles.btn} type='submit'>Sign In</button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>
                  Forgot Password? 
                  <Link className='text-red-500' to="/recovery"> Recover Now </Link>
                </span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}









*/