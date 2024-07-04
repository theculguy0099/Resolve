import React from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import LoginForm, { userId } from './login';
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Role_of_person from "./Data/Data2";

const Message_choose = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const role= Role_of_person();
    if (role === 'Admin') {
      navigate('/OTP/Dashboard');
    }
    
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
        // const uid = user.uid;
        // setUserId(uid);
        } else {
        navigate('/');
        }
    });

    const [complaint, setComplaint] = useState({
        complaintType: "",
        department: "",
        date: "",
        complaintDescription: "",
        location: "",
        claimRaisedAgainst: "",
        victimsName: "",
        complaint_id: "",
        status: "",
        message: []
      });


   

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-400" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-center mt-4">
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => navigate('/OTP/Dashboard/Choose_message_system/Message_raised')}>Message as Victim</button>
                </div>
                <div className="flex justify-center mt-4">
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => navigate('/OTP/Dashboard/Choose_message_system/Message_complaints/')}>Message as Mediator</button>
                </div>
                <div className="flex justify-center mt-4">
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => navigate('/OTP/Dashboard/')}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default Message_choose;
