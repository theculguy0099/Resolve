import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/login';
import DropdownForm from './components/details';
import DropdownForm_anony from './components/ano_non_anony';
import OTPForm from './components/otp';
import AllComplaints from './components/all_complaints';
import Non_assign_Complaints from './components/complaint_assign';
import Dashboard from './components/dashboard_new';
import Complaints_status from './components/complaint_status';
import One_complaint from './components/one_complaint';
import Assigned_Complaints from './components/assigned_complaint';
import Assigned_One_Complaint from './components/one_complaint_assigned';
import Assign_admin from './components/assign_admin';
import Message_complaints from './components/message';
import Message_other from './components/message_as_admin';
import Message_choose from './components/Choose_message_system';
import Message_as_victim from './components/message_as_victim';
import Message_raised from './components/message_raised';
import UpdateRole from './components/update_role';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/OTP/Dashboard" element={<Dashboard />} />
        <Route path="/OTP/Dashboard/AllComplaints" element={<AllComplaints />} />
        <Route path="/OTP/Dashboard/Update_role" element={<UpdateRole />} />
        <Route path="/OTP/Dashboard/AllComplaints/one_complaint" element={<One_complaint />} />
        <Route path="/OTP/Dashboard/complaint_status" element={<Complaints_status />} />
        <Route path="/OTP/Dashboard/Assigned_Complaints" element={<Assigned_Complaints />} />
        <Route path="/OTP/Dashboard/Assigned_Complaints/assigned_one_complaint" element={<Assigned_One_Complaint />} />
        <Route path="/OTP/Dashboard/Non_assign_Complaints" element={<Non_assign_Complaints />} />
        <Route path="/OTP/Dashboard/Non_assign_Complaints/Assign_admin" element={<Assign_admin />} />
        <Route path="/OTP/Dashboard/ano_non_anony" element={<DropdownForm_anony />} />
        <Route path="/OTP/Dashboard/ano_non_anony/details" element={<DropdownForm />} />
        <Route path="/OTP/Dashboard/Choose_message_system" element={<Message_choose />} />
        <Route path="/OTP/Dashboard/Choose_message_system/Message_complaints" element={<Message_complaints />} />
        <Route path="/OTP/Dashboard/Choose_message_system/Message_complaints/message_other" element={<Message_other />} />
        <Route path="/OTP/Dashboard/Choose_message_system/Message_raised" element={<Message_raised />} />
        <Route path="/OTP/Dashboard/Choose_message_system/Message_raised/Message_as_victim" element={<Message_as_victim />} />
      </Routes>
    </Router>
  );
}


export default App;
