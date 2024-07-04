import React from 'react';
import backgroundImage from './b_im_2.jpg';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const OTPForm = () => {

  const [otp, setOtp] = useState('');
  
  const navigate = useNavigate();

  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImage})`, 
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const buttonStyle = {
    backgroundColor: 'black',
    color: 'white', 
    padding: '8px',
    width: '48%', 
    borderRadius: '4px', 
    cursor: 'pointer', 
  };

  const Handlelogin = () => {
    // fetch('http://localhost:3001/signup/verify', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ otp }),
    // })
    // .then((res) => res.json())
    // // .then((data) => {
    //   // if (data.status === 200) {
    //     console.log("hi my name is kevin");
        navigate('/OTP/Dashboard');
      // }
    // })
  }

  const formhandle = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  };

  return (
        <div className="min-h-screen flex items-center justify-center" style={backgroundImageStyle}>
        <form className="bg-white p-8 rounded shadow-md" style={formhandle}>
        <h2 className="text-2xl font-semibold mb-6">OTP Verification</h2>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">OTP is sent to given Mobile Number</label>
        </div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Enter OTP</label>
        <div className="flex mb-4">
        {[1, 2, 3, 4].map((index) => (
            <input
            key={index}
            className="w-1/4 px-4 py-2 border rounded-md mr-2"
            type="text"
            placeholder="X"
            maxLength="1"
            />
        ))}
        </div>

        <button style={buttonStyle} onClick={Handlelogin} type="submit">Submit</button>
    </form>
    </div>
  );
};

export default OTPForm;