import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Table from './Table/Table'
import BasicTable from "./Table/Table";
import Role_of_person from "../components/Data/Data2"

const AllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
      getComplaints();
    }
  }, [userId]);

  const getComplaints = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users", userId, "Complaints"));
      const complaintList = querySnapshot.docs.map(doc => doc.data());
      setComplaints(complaintList);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

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

  const handleView = (id) => {
    localStorage.setItem('complaint_id', id);
    navigate('/OTP/Dashboard/AllComplaints/one_complaint');
  }

  return (
    <div className="p-4 bg-gray-100" style={backgroundImageStyle}>
      <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 mx-auto">
        {/* <BasicTable complaints={complaints} /> */}
        <table className="min-w-full bg-white border rounded-lg overflow-hidden border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">Complaint Type</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Date</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">More information</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((data) => (
              <tr key={data.complaint_id} className="hover:bg-gray-200 transition duration-300">
                <td className="px-6 py-4 border-b">{data.complaintType}</td>
                <td className="px-6 py-4 border-b">{data.date}</td>
                <td className="px-6 py-4 border-b">
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => handleView(data.complaint_id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => navigate('/OTP/Dashboard/')}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default AllComplaints;
