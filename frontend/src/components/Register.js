import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';

import styles from '../styles/Username.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: 'doyol56239@cnogs.com',
    username: 'example123',
    password: 'admin@123',
    profile: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFormValues({ ...formValues, profile: base64 });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if(!formValues.email || !formValues.username || !formValues.profile || !formValues.password) toast.error('All field are Required...!');
    else if (formValues.email.includes(" ") || formValues.username.includes(" ") || formValues.password.includes(" ")) toast.error('Invalid Values...!')
    //else if (!emailRegex.test(formValues.email)) toast.error("Invalid email address format!");
    else if(formValues.password.length < 4) toast.error("Password must be more than 4 characters long");
    else if(!specialCharacterRegex.test(formValues.password)) toast.error("Password must have special character");
    else{ 
        console.log('register');

          try {
            const { success, message } = await registerUser(formValues);
            if(success) {
              console.log('success');
              toast.success(message);
              navigate('/');
            } else {
              console.log('dsuccess');
              toast.error(message);
            }
          } catch (error) {
            console.log('esuccess');
            toast.error(error.message);
          }
      }
  };
  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{ width: "45%", paddingTop: '3em' }}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Happy to join you!</span>
          </div>

          <form className='py-1' onSubmit={handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={formValues.profile || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={handleFileChange} type="file" id='profile' name='profile' />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                className={styles.textbox}
                type="text"
                placeholder='Email*'
              />
              <input
                name="username"
                value={formValues.username}
                onChange={handleInputChange}
                className={styles.textbox}
                type="text"
                placeholder='Username*'
              />
              <input
                name="password"
                value={formValues.password}
                onChange={handleInputChange}
                className={styles.textbox}
                type="password"
                placeholder='Password*'
              />
              <button className={styles.btn} type='submit'>Register</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>
                Already Register? <Link className='text-red-500' to="/">Login Now</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
