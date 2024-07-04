    import React from "react";
    import { useNavigate } from 'react-router-dom';
    import backgroundImage from './b_im_2.jpg';
    import { useState, useEffect } from 'react';
    import { collection, getDocs, query, where } from 'firebase/firestore';
    import { db } from '../firebase.config';
    import LoginForm, { userId } from './login';
    import { onAuthStateChanged } from "firebase/auth";
    import { getAuth } from "firebase/auth";
    import Sentiment from 'sentiment';
    import Role_of_person from "../components/Data/Data2"

    const One_Complaint = () => {
        const [complaint, setComplaint] = useState(null);
        const [loading, setLoading] = useState(true);
        const [user_Id, setUser_Id] = useState(null);
        const [severity, setSeverity] = useState(null); // State to store the severity level of the complaint
        const [loadingSentiment, setLoadingSentiment] = useState(true); // State to indicate if sentiment analysis is loading

        const navigate = useNavigate();

        const role= Role_of_person();
        if (role === 'Admin') {
          navigate('/OTP/Dashboard');
        }

        const [userId, setUserId] = useState(null);
        const auth = getAuth();
        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid);
            } else {
                navigate('/');
            }
            });
        
            return () => unsubscribe();
        }, [auth, navigate]);
        
        useEffect(() => {
            if (userId) {
            fetchComplaint();
            }
        }, [userId]);

        // useEffect(() => {
        const fetchComplaint = async () => {    
            try {
                console.log(userId)
                const complaintRef = collection(db, `Users/${userId}/Complaints`);
                const q = query(complaintRef, where("complaint_id", "==", localStorage.getItem('complaint_id')));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setComplaint(doc.data());
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching complaint data:", error);
            }
        };

        useEffect(() => {
            if (complaint) {
                // Perform sentiment analysis only after complaint data is fetched
                calculateSentiment();
            }
        }, [complaint]);
        const calculateSentiment = async () => {
            try {
                setLoadingSentiment(true);
                const sentiment = new Sentiment();
                const { score } = sentiment.analyze(complaint.complaintDescription);
                // Determine severity level based on sentiment score
                if (score >= 2) {
                    setSeverity("Low");
                } else if (score >= 0 && score < 2) {
                    setSeverity("Medium");
                } else if (score < 0 && score >= -2) {
                    setSeverity("High");
                } else {
                    setSeverity("Very High");
                }
                setLoadingSentiment(false);
            } catch (error) {
                console.error("Error calculating sentiment:", error);
            }
        };

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-400" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                    {loading ? (
                        <p className="text-center">Loading...</p>
                    ) : (
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Complaint Details</h1>
                            <div className="mb-4">
                                  <p><span className="font-semibold">Complaint Type:</span> {complaint.complaintType}</p>
                                <p><span className="font-semibold">Department:</span> {complaint.department}</p>
                                <p><span className="font-semibold">Date:</span> {complaint.date}</p>
                                <p><span className="font-semibold">Complaint Description:</span> {complaint.complaintDescription}</p>
                                <p><span className="font-semibold">Location:</span> {complaint.location}</p>
                                <p><span className="font-semibold">Claim Raised Against:</span> {complaint.claimRaisedAgainst}</p>
                                <p><span className="font-semibold">Victim's Name:</span> {complaint.victimsName}</p>
                                <p><span className="font-semibold">Complaint ID:</span> {complaint.complaint_id}</p>
                                <p><span className="font-semibold">Severity:</span> {complaint.severity}</p> 
                            </div>
                            <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800" onClick={() => navigate('/OTP/Dashboard/AllComplaints')}>Back</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    export default One_Complaint;
