import React from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { useState, useRef,useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, Timestamp , onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';
import LoginForm, { userId } from './login';
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Role_of_person from "../components/Data/Data2"

const Message_as_victim = () => {
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const navigate = useNavigate();
    const messagesEndRef = useRef(null); // Create a new ref

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


    const handleAddMessage = async () => {
        // Add validation if needed
        const updatedComplaint = { ...complaint };
        updatedComplaint.message.push({
            Data: newMessage,
            Identify: "Victim" // You can replace this with the actual sender's name
        });
        setComplaint(updatedComplaint);
        setNewMessage(""); // Clear the input field
        // scrollToBottom();
        const usersRef = collection(db, 'Users');
        try {
            const usersSnapshot = await getDocs(usersRef);
            usersSnapshot.forEach(async (userDoc) => {
                const userId = userDoc.id;
                // console.log("Updating message for user:", userId); // Log the ID of the user being updated
                const complaintsRef = collection(db, `Users/${userId}/Complaints`);
                const query1 = where("complaint_id", "==", localStorage.getItem('complaint_id_message_victim'));

                const querySnapshot = await getDocs(query(complaintsRef, query1));
                querySnapshot.forEach(async (doc) => {
                    const complaintDoc = doc.ref;
                    console.log("Updating status for complaint:", doc.id); // Log the ID of the complaint being updated
                    try {
                        await updateDoc(complaintDoc, {
                            message: updatedComplaint.message
                        });
                        console.log("message updated successfully!");
                    } catch (error) {
                        console.error("Error updating message:", error);
                    }
                });
            });
        } catch (error) {
            console.error("Error getting users:", error);
        }
    };

    // useEffect(() => {

    //     const getAssignedComplaints = async () => {
    //         try {
    //           const usersSnapshot = await getDocs(collection(db, "Users"));
    //           const userComplaintPromises = [];

    //           usersSnapshot.forEach((userDoc) => {
    //             const userId = userDoc.id;
    //             userComplaintPromises.push(getDocs(collection(db, `Users/${userId}/Complaints`)));
    //           });

    //           const userComplaintSnapshots = await Promise.all(userComplaintPromises);
    //           const allComplaints = [];

    //           userComplaintSnapshots.forEach((userComplaintsSnapshot) => {
    //             const userComplaints = userComplaintsSnapshot.docs.map(doc => doc.data());
    //             allComplaints.push(...userComplaints);
    //           });
    //           const assignedComplaints = allComplaints.filter(complaint => complaint.complaint_id === localStorage.getItem('complaint_id_message_victim'));
    //           if (assignedComplaints.length === 0) {
    //           }
    //           else{
    //               setComplaint(assignedComplaints[0]);
    //           }

    //         } catch (error) {
    //           console.error("Error fetching complaints:", error);
    //         }
    //       }

    //     getAssignedComplaints();
    //     setLoading(false);
    // }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Users"), (querySnapshot) => {
            const userComplaintPromises = [];
            querySnapshot.forEach((userDoc) => {
                const userId = userDoc.id;
                userComplaintPromises.push(onSnapshot(collection(db, `Users/${userId}/Complaints`), (complaintsSnapshot) => {
                    const allComplaints = complaintsSnapshot.docs.map(doc => doc.data());
                    const assignedComplaints = allComplaints.filter(complaint => complaint.complaint_id === localStorage.getItem('complaint_id_message_victim'));
                    if (assignedComplaints.length > 0) {
                        setComplaint(assignedComplaints[0]);
                    }
                }));
            });
            Promise.all(userComplaintPromises).then(() => {
                setLoading(false);
            }).catch(error => {
                console.error("Error fetching complaints:", error);
            });
        });

        return () => unsubscribe();
    }, []);

    /* useEffect(() => {
        scrollToBottom();
    }, [complaint.message]); */

    /*const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };*/


    // Scroll to the bottom when the messagesEndRef changes (new message added)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [complaint.message]);



    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '20px',
    };

    const buttonStyle = {
        backgroundColor: 'black',
        color: 'white',
        padding: '8px',
        width: '48%',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior
            handleAddMessage();
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to the bottom when Enter is pressed
        }
    };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-400" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="max-w-7xl w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800">Complaint ID: {complaint.complaint_id}</h1>
                <div className="overflow-y-auto h-96">
                    {complaint.message.map((msg, index) => (
                        <React.Fragment key={index}>
                        {msg.Identify === 'Admin' ? (
                            <div className={`bg-blue-200 p-3 rounded-lg mb-4 max-w-md ${msg.Identify === 'Admin' ? 'mr-auto' : 'ml-auto'}`}>
                                <p className="text-base text-gray-800">{msg.Data}</p>
                                <p className="text-sm text-gray-600">Sent By: {msg.Identify}</p>
                            </div>
                        ) : (
                            <div className={`bg-yellow-200 p-3 rounded-lg mb-4 max-w-md ${msg.Identify === 'Victim' ? 'ml-auto' : 'mr-auto'}`}>
                                <p className="text-base text-gray-800">{msg.Data}</p>
                                <p className="text-sm text-gray-600">Sent By: {msg.Identify}</p>
                            </div>
                        )}
                        {index === complaint.message.length - 1 && ( // Add a empty div at the end to scroll to
                            <div ref={messagesEndRef} />
                        )}
                    </React.Fragment>
                    ))}
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                </div>
                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={handleAddMessage}>Add Message</button>
                    <button style={buttonStyle} onClick={() => navigate('/OTP/Dashboard/Choose_message_system/Message_raised')}>Back</button>
                </div>
            </div>
        </div>
    );

};

export default Message_as_victim;

