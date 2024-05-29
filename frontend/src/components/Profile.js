import React, { useState, useEffect } from 'react';
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';

export default function Profile() {
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
    profile: ''
  });

  useEffect(() => {
    if(apiData) {
      setFormValues({
        firstName: apiData?.firstName || '',
        lastName: apiData?.lastName || '',
        email: apiData?.email || '',
        mobile: apiData?.mobile || '',
        address: apiData?.address || '',
        profile: apiData?.profile || avatar
      });
    }
  }, [apiData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFormValues({ ...formValues, profile: fileReader.result });
      };
      fileReader.readAsDataURL(files[0]);
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formValues.firstName || !formValues.lastName || !formValues.email || !formValues.address || !formValues.mobile) {
      toast.error("All fields are required!");
    } else if (formValues.firstName.includes(" ") || formValues.lastName.includes(" ") || formValues.email.includes(" ") || formValues.mobile.includes(" ")) {
      toast.error("Wrong values!");
    } else if (!emailRegex.test(formValues.email)) {
      toast.error("Invalid email address format!");
    } else {
      try {
        const { data } = await updateUser(formValues);
        console.log(data);
        toast.success('Update Successfully!');
      } catch (error) {
        toast.error('Could not update!');
      }
    }
  };

  const userLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>;
  if (serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-center items-center h-screen'>
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "45%", paddingTop: '3em' }}>
          
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>You can update the details.</span>
          </div>

          <form className='py-1' onSubmit={handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={formValues.profile} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
              </label>
              <input onChange={handleInputChange} type="file" id='profile' name='profile' />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input name="firstName" value={formValues.firstName} onChange={handleInputChange} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='FirstName' />
                <input name="lastName" value={formValues.lastName} onChange={handleInputChange} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='LastName' />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input name="mobile" value={formValues.mobile} onChange={handleInputChange} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile No.' />
                <input name="email" value={formValues.email} onChange={handleInputChange} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*' />
              </div>

              <input name="address" value={formValues.address} onChange={handleInputChange} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Address' />
              <button className={styles.btn} type='submit'>Update</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>
                Come back later? 
                <button onClick={userLogout} className='text-red-500'>Logout</button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}






/*
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
^[^\s@]+ ensures that the email starts with one or more characters that are not whitespace or @.
@[^\s@]+ ensures that there is a single @ symbol followed by one or more characters that are not whitespace or @.
\.[^\s@]+$ ensures that there is a dot (.) followed by one or more characters that are not whitespace or @, and the string ends after these characters.



*/