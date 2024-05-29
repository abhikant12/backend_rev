import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store'
import styles from '../styles/Username.module.css';
import { authenticate } from '../helper/helper';


export default function Username(){

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);
  const [text, setText] = useState("abhikant");
  

  async function handleSubmit(event){
      event.preventDefault();                                           // Prevent default form submission behavior
      if(!text){
          toast.error('Username Required...!');
      }
      else if(text.includes(" ")){
           toast.error('Invalid Username...!');
      }
      else{
        const { status } = await authenticate(text);                    // check user exist or not
        if(status !== 200){
          toast.error('User does not exist...!');
        }
        else{
          setUsername(text);
          navigate('/password');
        }  
    }
  }



  return (
    <div className="container mx-auto">

     <Toaster position='top-center' reverseOrder = {false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Hello Again!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>  Explore More by connecting with us.  </span>            
          </div>

          <form onSubmit = {(event) => handleSubmit(event)}  className='py-1'>
              <div className='profile flex justify-center py-4'>
                  <img src = {avatar} className={styles.profile_img} alt="avatar" />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                  <input type="text"  value =  {text}  onChange={(e) => (setText(e.target.value))}  className={styles.textbox}  placeholder='Username' />
                  <button type="submit" className={styles.btn} > Let's Go </button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>
                    Not a Member 
                    <Link className='text-red-500' to="/register"> Register Now </Link>
                </span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}



/*
What is event.preventDefault()?
event.preventDefault() is a method of the Event interface.it prevents the default behavior associated with that element  from occurring. This method is 
particularly useful in situations where you want to handle an event in a custom way instead of letting the browser execute its default action.

Why Use event.preventDefault() in Form Handling?
When you submit a form, the browser's default behavior is to make a POST request and reload the page with the form data. This behavior 
is often undesirable in modern web applications, especially those using React or other single-page application frameworks, where you
want to handle the form submission asynchronously without reloading the page.

-> event.preventDefault() is called inside the handleSubmit function to prevent the form from submitting the traditional way 
(which would involve a page reload). This allows you to handle the form submission entirely within JavaScript, making asynchronous 
requests to the server if needed. 
-> Custom Handling: After preventing the default behavior, you can add custom validation logic. If validation passes, you can make an API call 
to check the username and handle the response without reloading the page.



React has several libraries for displaying toast notifications, two of the most popular being react-hot-toast and react-toastify. 
-> Choose react-hot-toast for a simpler, more modern-looking, and lightweight solution. Opt for react-toastify if you need a more feature-rich, 
   customizable, and accessible notification system. 

React-Hot-Toast
import toast from 'react-hot-toast';

<Toaster position='top-center' reverseOrder = {false}></Toaster>           // add it in container or In your main component

toast.success('This is a success message!');              // Usage
toast.error('This is an error message!');


React-Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.success('This is a success message!');         // Usage
toast.error('This is an error message!');

<ToastContainer />                                  // In your main component
*/