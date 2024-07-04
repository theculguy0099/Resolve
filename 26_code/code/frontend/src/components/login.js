

import React from 'react';
import backgroundImage from './b_im_2.jpg';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'; 
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import {
  getDoc,
  setDoc,
  doc,
  collection,
} from "firebase/firestore";
import { firestore } from "../firebase.config";

var userId = null;


const LoginForm = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [user_Id, setUserid] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          navigate('/OTP/Dashboard');
        }
      });
      
      return () => unsubscribe();
    }, [navigate]);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  async function saveUserDataToFirestore(uid) {
    const userDocRef = doc(collection(firestore, "Users"), uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {
        UID: uid,
        Role: "Employee",
      });
    }
  }

  async function createComplaintsCollection(uid) {
    const complaintsCollectionRef = collection(firestore, `Users/${uid}/Complaints`);
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        // localStorage.setItem('user_Id', res.user.uid);
        await saveUserDataToFirestore(res.user.uid);
        await createComplaintsCollection(res.user.uid);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className="flex items-center justify-center h-screen"
    style={{
      backgroundImage: `url(${backgroundImage})`, // Replace with the actual path to your image
      backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat', // Adjust the background repeat as needed
    }}>
      <div className="max-w-lg w-full mx-auto p-2">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          navigate('/OTP/Dashboard')
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="p-6 bg-gray-300 text-black">
              <h1 className="text-center text-3xl font-medium">
                Welcome to <br /> Resolve
              </h1>
            </div>
            <div className="p-6 bg-gray-300">
              {showOTP ? (
                <>
                  <div className="bg-blue-500 text-white w-fit mx-auto p-4 rounded-full">
                    <BsFillShieldLockFill size={30} />
                  </div>
                  <div className="flex justify-center items-center h-full">
                  <label className="font-bold text-xl text-center text-gray-700 p-3">
                    Enter your OTP
                  </label>
                  </div>
                  <div className="flex justify-center items-center h-full">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    autoFocus
                    containerStyle="opt-container"
                  />
                  </div>
                  
                  <button
                    onClick={onOTPVerify}
                    className="bg-blue-600 w-full flex items-center justify-center py-2.5 text-white rounded mt-4"
                    disabled={loading}
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin mr-2" />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-blue-500 text-white w-fit mx-auto p-4 rounded-full">
                    <BsTelephoneFill size={30} />
                  </div>
                  <div className="flex justify-center items-center h-full">
                  <label className="font-bold text-xl text-center text-gray-700 p-3">
                    Verify your phone number
                  </label>
                  </div>
                  {/* <PhoneInput
                    country="in"
                    value={ph}
                    onChange={setPh}
                    // className="w-full p-2 mt-2 border rounded"
                  /> */}
                  <div className="flex justify-center items-center">
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    value={ph}
                    onChange={setPh}
                    placeholder="Enter your phone number"
                    inputProps={{
                      maxLength: 10,
                      className: "w-full p-2 mt-2 border rounded focus:outline-none focus:ring focus:border-blue-300",
                    }}
                  />
                </div>
                  <button
                    onClick={onSignup}
                    className="bg-blue-600 w-full flex items-center justify-center py-2.5 text-white rounded mt-4"
                    disabled={loading}
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin mr-2" />
                    )}
                    <span>Send code via SMS</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};


export default LoginForm;
export { userId };
