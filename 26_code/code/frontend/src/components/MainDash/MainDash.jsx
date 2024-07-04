import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cards from '../Cards/Cards'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Role_of_person from "../Data/Data2";
import Table from '../Table/Table'
import './MainDash.css'
import BasicTable from '../Table/Table'


const MainDash = () => {
  const [complaints, setComplaints] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const Role = Role_of_person();

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
  
      // Sort complaints by date in descending order
      complaintList.sort((a, b) => new Date(b.date) - new Date(a.date));
      // Slice the array to include only the top 5 recent complaints
      const top5RecentComplaints = complaintList.slice(0, 5);
  
      setComplaints(top5RecentComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };
  const handleView = (id) => {
    localStorage.setItem('complaint_id', id);
    navigate('/OTP/Dashboard/AllComplaints/one_complaint');
  };

  return (
    <div className="MainDash">
        <h1>{Role} Dashboard</h1>
        <Cards />
        {/* <Table/> */}
        <BasicTable complaints={complaints} handleView={handleView} />
    </div>
  )
}

export default MainDash;
