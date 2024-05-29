import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../helper/helper';
import { useAuthStore } from '../store/store';
import useFetch from '../hooks/fetch.hook';
import styles from '../styles/Username.module.css';

export default function Reset(){

  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] = useFetch('createResetSession');
  const [formValues, setFormValues] = useState({
    password: '',
    confirm_pwd: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
     // Validate password
     const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

     if(!formValues.password || !formValues.confirm_pwd) toast.error("Both Password Required...!");
     else if(formValues.password !== formValues.confirm_pwd) toast.error("Passwords do not match");
     else if(formValues.password.includes(" ")) toast.error("Wrong Password...!");
     else if(formValues.password.length < 4) toast.error("Password must be more than 4 characters long");
     else if(!specialCharacterRegex.test(formValues.password)) toast.error("Password must have special character");
     else{
          try {
            let { success, message } = await resetPassword({ username, password: formValues.password });
            if(success) {
              toast.success(message);
              navigate('/password');
            } else {
              toast.error(message);
            }
          } catch (error) {
            toast.error(error.message);
          }
        }
  };

  if(isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Reset</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Enter new password.</span>
          </div>

          <form className='py-20' onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                className={styles.textbox}
                type="password"
                placeholder='New Password'
              />
              <input
                name="confirm_pwd"
                value={formValues.confirm_pwd}
                onChange={handleInputChange}
                className={styles.textbox}
                type="password"
                placeholder='Repeat New Password'
              />
              <button className={styles.btn} type='submit'>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
