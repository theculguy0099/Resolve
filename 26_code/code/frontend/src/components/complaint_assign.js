import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Role_of_person from "../components/Data/Data2"

const Non_assign_Complaints = () => {
  const navigate = useNavigate();
  // const [userId, setUserId] = useState(null);
  
  const role= Role_of_person();
  if (role === 'Employee' || role === 'Mediator') {
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
  const [nonAssignedComplaints, setNonAssignedComplaints] = useState([]);

  const getNonAssignedComplaints = async () => {
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

      // only those complaints whose field assign_to is equal to ""
      const nonAssignedComplaints = allComplaints.filter(complaint => complaint.Assign_to === "");

      setNonAssignedComplaints(nonAssignedComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  }

  useEffect(() => {
    getNonAssignedComplaints();
  }, []); // Run the effect once on component mount

  const handleAssignAdmin = async (complaintId) => {
    localStorage.setItem('complaint_id_assign', complaintId);
    navigate('/OTP/Dashboard/Non_assign_Complaints/Assign_admin');
  }

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

  return (
    <div className="p-4 bg-gray-100" style={backgroundImageStyle}>
      <div className="w-full md:w-3/4 lg:w-4/5 xl:w-4/5 mx-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">Complaint ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Date</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Type</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Assigned Admin</th>
            </tr>
          </thead>
          <tbody>
            {nonAssignedComplaints.map((complaint, index) => (
              <tr key={index} className="hover:bg-gray-200 transition duration-300">
                <td className="px-6 py-4 border-b">{complaint.complaint_id}</td>
                <td className="px-6 py-4 border-b">{complaint.date}</td>
                <td className="px-6 py-4 border-b">{complaint.complaintType}</td>
                <td className="px-6 py-4 border-b">
                  <button
                    className="px-4 py-2 bg-gray-800 text-white rounded-md"
                    onClick={() => handleAssignAdmin(complaint.complaint_id)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => navigate('/OTP/Dashboard')}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default Non_assign_Complaints;
