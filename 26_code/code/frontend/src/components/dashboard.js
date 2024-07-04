import React from "react";
import { useNavigate } from 'react-router-dom';
import { Piachart } from './Piachart';
import { Barchart } from './Brchart';

const Dashboard = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/');
    }
    const handleRaiseComplaint = () => {
        navigate('/OTP/Dashboard/ano_non_anony');
    }
    const handleAllComplaints = () => {
        navigate('/OTP/Dashboard/AllComplaints');
    }
    const handleNonAssignedComplaints = () => {
        navigate('/OTP/Dashboard/Non_assign_Complaints');
    }
    const handleComplaintStatus = () => {
        navigate('/OTP/Dashboard/complaint_status');
    }

    const handleAssignedComplaints = () => {
        navigate('/OTP/Dashboard/Assigned_Complaints');
    }

    



  return (
    <>
      <div className="flex">
        <div className="w-1/4 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 h-screen p-4 shadow-md rounded-r-lg">
          <div className="flex items-center justify-center">
            <img
              src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
              alt="profile"
              className="w-16 h-16 rounded-full"
            />
          </div>
          <h2 className="text-white text-center my-4">Resolve</h2>
          <ul>
            <li className="text-white p-2 hover:bg-gray-700 cursor-pointer transition duration-300 transform hover:scale-105" onClick={handleRaiseComplaint}>
              Raise a Complaint
            </li>
            <li className="text-white p-2 hover:bg-gray-700 cursor-pointer transition duration-300 transform hover:scale-105" onClick={handleAllComplaints}>
              All Complaints
            </li>
            <li className="text-white p-2 hover:bg-gray-700 cursor-pointer transition duration-300 transform hover:scale-105" onClick={handleNonAssignedComplaints} >
              Non Assigned Complaints
            </li>
            <li className="text-white p-2 hover:bg-gray-700 cursor-pointer transition duration-300 transform hover:scale-105" onClick={handleComplaintStatus}>
              Status of Complaints
            </li>
            <li className="text-white p-2 hover:bg-gray-700 cursor-pointer transition duration-300 transform hover:scale-105" onClick={handleAssignedComplaints}>
              Assigned Complaints
            </li>
            <li className="text-white p-2 hover:bg-gray-700 cursor-pointer transition duration-300 transform hover:scale-105" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </div>
        <div className="w-4/4 p-4 bg-gray-100 flex-grow flex justify-center">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>
          <div className="w-full">
            <Barchart />
          </div>
          {/* make some space between the charts */}
          <div className="w-full mt-8">
            <Piachart />
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
