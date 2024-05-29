import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useAuthStore } from '../store/store';
import styles from '../styles/Username.module.css';

export default function Recovery(){

  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();                                      // Prevent default form submission behavior
    try {
      const { success, message } = await verifyOTP({ username, code: OTP });
      if (success) {
        toast.success(message);
        navigate('/reset');
      } else {
        toast.error('Wrong OTP! Check email again!');
      }
    } catch (error) {
      toast.error('An error occurred during verification!');
    }
  }

  async function fetchOTP(){
    try {
      const OTP = await generateOTP(username);
      if(OTP){
        toast.success('OTP has been sent to your email!');
      } else {
        toast.error('Problem while generating OTP!');
      }
    } catch (error) {
      toast.error('An error occurred while generating OTP!');
    }
  }

  useEffect(() => {
    fetchOTP();
  }, []);

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false} />

      <div className='flex justify-center items-center h-screen'>

        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Enter OTP to recover password.</span>
          </div>

          <form className='pt-20' onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className='py-4 text-sm text-left text-gray-500'>Enter 6 digit OTP sent to your email address.</span>
                <input onChange={(e) => setOTP(e.target.value) } value={OTP} className={styles.textbox} type="text" placeholder='OTP' />
              </div>
              <button className={styles.btn} type='submit'>Recover</button>
            </div>
          </form>

          <div className="text-center py-4">
            <span className='text-gray-500'>
              Can't get OTP?
              <button onClick={fetchOTP} className='text-red-500'> Resend </button>
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
}
