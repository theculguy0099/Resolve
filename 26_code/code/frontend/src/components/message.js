import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Role_of_person from "../components/Data/Data2"

// let User_self = localStorage.getItem('user_Id');

const Message_complaints = () => {

    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    const role= Role_of_person();
    if (role === 'Admin') {
      navigate('/OTP/Dashboard');
    }

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
          getAssignedComplaints();
        }
      }, [userId]);
    
    const [AssignedComplaints, setAssignedComplaints] = useState([]);
  
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

        const assignedComplaints = allComplaints.filter(complaint => complaint.Assign_to === userId);

        setAssignedComplaints(assignedComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    }
  
    // useEffect(() => {
    //     getAssignedComplaints();
    // }, []);

    const backgroundImageStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

      const HandleMessage = (id) => {
        // complaint_id = id;
        localStorage.setItem('complaint_id_message', id);
        console.log(id);
        navigate('/OTP/Dashboard/Choose_message_system/Message_complaints/message_other');
      }

    return (
        <div className="p-4 bg-gray-100" style={backgroundImageStyle}>
        <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 mx-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">Complaint Type</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Date</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">More information</th>
              </tr>
            </thead>
            <tbody>
              {AssignedComplaints.map((data) => (
                <tr key={data.complaint_id} className="hover:bg-gray-200 transition duration-300">
                  <td className="px-6 py-4 border-b">{data.complaintType}</td>
                  <td className="px-6 py-4 border-b">{data.date}</td>
                  <td className="px-6 py-4 border-b">
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => HandleMessage(data.complaint_id)}>
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => navigate('/OTP/Dashboard/Choose_message_system')}>Back</button>
          </div>
        </div>
      </div>
    );
};

export default Message_complaints;