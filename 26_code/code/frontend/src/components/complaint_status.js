import React from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import Sidebar from "./Sidebar/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";


const ComplaintDataComponent = () => {
  const [complaints, setComplaints] = useState([]);
  // const [user, setUser] = useState(null);
  // const [user_Id, setUser_Id] = useState(null);

  const navigate = useNavigate();
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
        getComplaints();
      }
    }, [userId]);

  const getComplaints = async () => {
    try {
      // console.log(user_Id);
      const querySnapshot = await getDocs(collection(db, "Users", userId, "Complaints"));
      const complaintList = querySnapshot.docs.map(doc => doc.data());
      setComplaints(complaintList);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  // useEffect(() => {
  //   // Retrieve userId from localStorage on component mount
  //   const storedcomplaintId = localStorage.getItem('user_Id');
  //   if (storedcomplaintId) {
  //     setUser_Id(storedcomplaintId);
  //   }
  // }, []);

  // useEffect(() => {
  //   getComplaints();
  // }, []); // Run the effect once on component mount

  // Return the list of complaints
  return complaints
}


const Complaints_status = () => {

  const navigate = useNavigate();

  const ComplaintData = ComplaintDataComponent();

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
    <div>
      <div>
          {/* <Sidebar /> */}
        <div className="p-4 bg-gray-100" style={backgroundImageStyle}>
          <div className="w-full md:w-2/3 lg:w-3/4 xl:w-1/3 mx-auto">
            <table className="min-w-full bg-white border rounded-lg overflow-hidden border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Id</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Type</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">date</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {ComplaintData.map((data) => (
                  <tr key={data.complaint_id} className="hover:bg-gray-200 transition duration-300">
                    <td className="px-6 py-4 border-b">{data.complaint_id}</td>
                    <td className="px-6 py-4 border-b">{data.complaintType}</td>
                    <td className="px-6 py-4 border-b">{data.date}</td>
                    <td className="px-6 py-4 border-b">{data.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4"> {/* Center the button horizontally */}
              <button className="bg-black text-white py-2 px-8 rounded-lg hover:bg-gray-800" onClick={() => navigate('/OTP/Dashboard')}>Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints_status;
