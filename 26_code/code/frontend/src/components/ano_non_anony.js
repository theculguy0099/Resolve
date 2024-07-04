import React from 'react';
import backgroundImage from './b_im_2.jpg';
import { startTransition } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import Role_of_person from "../components/Data/Data2"

export const data = {
    Anonymous : '',
    name_of_employee: '',
    department_of_employee: '',
    email_of_employee: '',
}


const DropdownForm_anony = () => {

  const navigate = useNavigate();
  // const [userId, setUserId] = useState(null);

  const role= Role_of_person();
  if (role === 'Admin') {
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

    const [formData1, setFormData1] = useState({
    Anonymous : '',
    name_of_employee: '',
    department_of_employee: '',
    email_of_employee: '',
  });


  const  handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData1((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [remainAnonymous, setRemainAnonymous] = useState(false);

  // const navigate = useNavigate();

  const Handleback = () => {
    navigate('/OTP/Dashboard');
  }

  const Handlesubmit = (e) => {
    e.preventDefault();
    data.name_of_employee = formData1.name_of_employee;
    data.department_of_employee = formData1.department_of_employee;
    data.email_of_employee = formData1.email_of_employee;
    if(remainAnonymous){
      data.Anonymous = "Yes";
    }
    else{
      data.Anonymous = "No";
    }
    console.log(formData1);
    navigate('/OTP/Dashboard/ano_non_anony/details');
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

  const Formsttyle = {
    width: '100%',
    maxWidth: '650px',
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  };

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
    width: '48%',
    borderRadius: '4px', 
    cursor: 'pointer',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400" style={backgroundImageStyle}>
      <form className="bg-white p-8 rounded shadow-md max-w-md" style={Formsttyle}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Do you want to raise Complaint as Remain Anonymous?</h2>
        <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="anonymousCheckbox"> 
          Remain Anonymous
        </label>
        <input
          type="checkbox"
          id="anonymousCheckbox"
          checked={remainAnonymous}
          onChange={() => setRemainAnonymous(!remainAnonymous)}
        />
      </div>

      {!remainAnonymous && (
            <>
            <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedbackType">your name</label>
            <input type="text" className="w-full px-4 py-2 border rounded-md" id="feedbackType_name" name="name_of_employee" value={formData1.name_of_employee} onChange={handleInputChange} placeholder="Enter Your Name..." />
            </div>
            <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dropdown_depart">select your Department</label>
            <select className="w-full px-4 py-2 border rounded-md appearance-none" id="dropdown_depart" name="department_of_employee" value={formData1.department_of_employee} onChange={handleInputChange}>
                <option value="">Select Option</option>
                <option value="HR Department">HR Department</option>
                <option value="Frontend Department">Frontend Department</option>
                <option value="Backend Department">Backend Department</option>
                <option value="Design Department">Design Department</option>
            </select>
            </div>

            <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedbackType">your email address</label>
            <input type="text" className="w-full px-4 py-2 border rounded-md" id="feedbackType_email" value={formData1.email_of_employee} onChange={handleInputChange} name="email_of_employee"  placeholder="Enter Your Email..." />
            </div>

            </>
        )}
         <div style={buttonContainerStyle}>
            <button style={buttonStyle} onClick={Handleback}>Back</button>
            <button style={buttonStyle} onClick={Handlesubmit} type="submit">Submit</button>
            </div>
      </form>
    </div>
  );
};

export default DropdownForm_anony;