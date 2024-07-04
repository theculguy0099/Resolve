import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { updateDoc,addDoc } from "firebase/firestore";
import { db } from '../firebase.config';
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Role_of_person from "../components/Data/Data2"

const Assign_admin = () => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
  
    const role= Role_of_person();
    if (role === 'Employee' || role === 'Mediator') {
      navigate('/OTP/Dashboard');
    }
  
  // const [userId, setUserId] = useState(null);
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
        complaint_id: ""
      });

    const[users_name, setUsers_name] = useState([]);


    const getUsersname = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "Users"));
            const users_name = [];
            usersSnapshot.forEach((userDoc) => {
                const username = userDoc.data().Name;
                users_name.push(username);
            });
            // console.log(users_name);
            setUsers_name(users_name);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

  
    const getAssignedComplaints = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const userComplaintPromises = [];
        
        usersSnapshot.forEach((userDoc) => {
          const userId = userDoc.id;
          userComplaintPromises.push(getDocs(collection(db, `Users/${userId}/Complaints`)));
        });
    
        const userComplaintSnapshots = await Promise.all(userComplaintPromises);
        const allComplaints = [];
    
        userComplaintSnapshots.forEach((userComplaintsSnapshot) => {
          const userComplaints = userComplaintsSnapshot.docs.map(doc => doc.data());
          allComplaints.push(...userComplaints);
        });
    
        // only those  complaints whose field assign_to is equal to user_self

        const assignedComplaints = allComplaints.filter(complaint => complaint.complaint_id === localStorage.getItem('complaint_id_assign'));
        // console.log(assignedComplaints);
        // if (assignedComplaints.length === 0) {
        //   navigate('/OTP/Dashboard/Assigned_Complaints');
        // }
        if (assignedComplaints.length === 0) {
        }
        else{
            setComplaint(assignedComplaints[0]);
        }
        // setComplaint(assignedComplaints);
        
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    }

    const [selectedUser, setSelectedUser] = useState("");
    // const [userid1, setUserid] = useState("");

    const HandleAssignAdim = async () => {
        let userid1 = "";
        const usersSnapshot1 = await getDocs(collection(db, "Users"));
        usersSnapshot1.forEach(async (userDoc) => {
            if(userDoc.data().Name === selectedUser){
                userid1 = userDoc.id;
            }
        });
        try{
            const notificationData = {
                message: `you have been assigned a new complaint with id ${complaint.complaint_id}`,
                timestamp: new Date(),
                isread: false,
                readat: new Date(),
            };
            const notificationsRef = collection(db, `Users/${userid1}/Notifications`);
            await addDoc(notificationsRef, notificationData);
            }
            catch (error) {
                console.error("Error sending notification:", error);
            }

        const usersSnapshot = await getDocs(collection(db, "Users"));
    
        // Iterate through each user
        usersSnapshot.forEach(async (userDoc) => {
            const userId = userDoc.id;
            const userComplaintsRef = collection(db, `Users/${userId}/Complaints`);
            const userComplaintsSnapshot = await getDocs(userComplaintsRef);
        
            // Iterate through each user's complaints
            userComplaintsSnapshot.forEach(async (complaintDoc) => {
                const complaintData = complaintDoc.data();
                if (complaintData.complaint_id === complaint.complaint_id) {
                await updateDoc(complaintDoc.ref, {
                    Assign_to: userid1,
                });
                }
            });
        });
        navigate('/OTP/Dashboard/Non_assign_Complaints');
    }
    

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
        width: '180px',
        borderRadius: '4px',
        cursor: 'pointer',
        // marginBottom: '10px',
      };

      const secondButtonStyle = {
        ...buttonStyle,
        marginLeft: '10px', // Add margin to create space between buttons
    };

    const selectContainerStyle = {
        marginBottom: '20px', // Add margin to create space between divs
    };
  
    useEffect(() => {
        getUsersname();
        getAssignedComplaints();
        setLoading(false);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-400" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
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
                            <p><span className="font-semibold">Complaint Severity:</span> {complaint.severity}</p>
                            <p><span className="font-semibold">Suggested Solution:</span> {complaint.suggested_solution}</p>

                        </div>
                        <div style={selectContainerStyle}>
                            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2">
                            <option value="">Assign Admin</option>
                            {users_name.map((user, index) => (
                                <option key={index} value={user}>{user}</option>
                            ))}
                        </select>
                        </div>
                        <div className={buttonContainerStyle}>
                        <button style={buttonStyle} onClick={HandleAssignAdim}>Assign</button>
                        <button style={secondButtonStyle} onClick={() => navigate('/OTP/Dashboard/Non_assign_Complaints')}>Back</button>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default Assign_admin;