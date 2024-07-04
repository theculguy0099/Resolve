import React from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where,addDoc } from 'firebase/firestore';
import { updateDoc } from "firebase/firestore";
import { db } from '../firebase.config';
import LoginForm, { userId } from './login';
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Role_of_person from "../components/Data/Data2"

const Assigned_One_Complaint = () => {
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
  
    const role= Role_of_person();
    if (role === 'Employee') {
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
        complaint_id: "",
        status: ""
      });
  
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

        const assignedComplaints = allComplaints.filter(complaint => complaint.complaint_id === localStorage.getItem('complaint_id'));
        // console.log(assignedComplaints);
        // if (assignedComplaints.length === 0) {
        //   navigate('/OTP/Dashboard/Assigned_Complaints');
        // }
        if (assignedComplaints.length === 0) {
        }
        else{
            setComplaint(assignedComplaints[0]);
        }
        
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    }
  
    useEffect(() => {
        getAssignedComplaints();
        setLoading(false);
    }, []);

    const handleStatusChange = async (e) => {
      setComplaint((prevData) => ({
          ...prevData,
          status: e.target.value,
      }));
  
      // Change status in the database for all users
      const usersRef = collection(db, 'Users');
      try {
          const usersSnapshot = await getDocs(usersRef);
          usersSnapshot.forEach(async (userDoc) => {
              const userId = userDoc.id;
              const complaintsRef = collection(db, `Users/${userId}/Complaints`);
              const query1 = where("complaint_id", "==", localStorage.getItem('complaint_id'));
  
              const querySnapshot = await getDocs(query(complaintsRef, query1));
              querySnapshot.forEach(async (doc) => {
                  const complaintDoc = doc.ref;
                  console.log("Updating status for complaint:", doc.id); // Log the ID of the complaint being updated
                  try {
                      await updateDoc(complaintDoc, {
                          status: e.target.value
                      });
                      console.log("Status updated successfully!");
                      const notificationData = {
                        message: `Status of your complaint ${localStorage.getItem('complaint_id')} changed to ${e.target.value}`,
                        timestamp: new Date(),
                        isread: false,
                        readat: new Date(),
                    };
                    const notificationsRef = collection(db, `Users/${userId}/Notifications`);
                    await addDoc(notificationsRef, notificationData);
                    console.log("Notification added successfully inside complaint document!");
                  } catch (error) {
                      console.error("Error updating status:", error);
                  }
              });
          });
      } catch (error) {
          console.error("Error getting users:", error);
      }
  }
  

   

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
                            <p><span className="font-semibold">Status:</span> {complaint.status}</p>
                            <p><span className="font-semibold">Severity:</span> {complaint.severity}</p>
                            <p><span className="font-semibold">suggested Solution:</span> {complaint.suggested_solution}</p>
                        </div>
                        <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="statusDropdown">Change Status:</label>
                        <select className="w-full px-4 py-2 border rounded-md" id="statusDropdown" onChange={handleStatusChange} value={complaint.status}>
                            <option value="Active">Active</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                        <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800" onClick={() => navigate('/OTP/Dashboard/Assigned_Complaints')}>Submit</button>
                    </div>
            </div>
        </div>
    );
};

export default Assigned_One_Complaint;
