import "./dashboard.css";
import MainDash from "./MainDash/MainDash";
import Sidebar from "./Sidebar/Sidebar";
import { getAuth, signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUserId(uid);
    } else {
      navigate('/');
    }
  });
  return (
    <div className="Dash">
      <div className="DashGlass">
        <Sidebar />
        <MainDash />
      </div>
    </div>
  );
}

export default Dashboard;