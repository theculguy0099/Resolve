import { useState, useEffect } from "react";
import backgroundImage from "./b_im_2.jpg";
import { startTransition } from "react";
import "./details";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { data } from "./ano_non_anony";
import LoginForm, { userId } from "./login";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import Sentiment from "sentiment";
import Role_of_person from "../components/Data/Data2"
import { GoogleGenerativeAI } from "@google/generative-ai";


const DropdownForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState(null); // State to store the severity level of the complaint
  const [complaintDescription, setComplaintDescription] = useState(null);
  const [loadingSentiment, setLoadingSentiment] = useState(true); // State to indicate if sentiment analysis is loading

  // const role= Role_of_person();
  // if (role === 'Admin') {
  //   navigate('/OTP/Dashboard');
  // }

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUserId(uid);
    } else {
      navigate("/");
    }
  });

  const [formData, setFormData] = useState({
    complaintType: "",
    department: "",
    date: "",
    complaintDescription: "",
    location: "",
    claimRaisedAgainst: "",
    victimsName: "",
    name_of_employee: "",
    department_of_employee: "",
    email_of_employee: "",
    Anonymous: "",
    complaint_id: "",
    Assign_to: "",
    status: "",
    severity: "",
    message: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const navigate = useNavigate();

  const Handleback = () => {
    navigate("/OTP/Dashboard/ano_non_anony");
  };

  const clear_form = () => {
    setFormData({
      complaintType: "",
      department: "",
      date: "",
      complaintDescription: "",
      location: "",
      claimRaisedAgainst: "",
      victimsName: "",
    });
  };

  useEffect(() => {
    if (complaintDescription) {
      // Perform sentiment analysis only after complaint data is fetched
      calculateSentiment();
    }
  }, [complaintDescription]);

  const calculateSentiment = async () => {
    try {
      setLoadingSentiment(true);
      const sentiment = new Sentiment();
      const { score } = sentiment.analyze(complaintDescription);
      // Determine severity level based on sentiment score
      if (score >= 2) {
        setSeverity("Low");
      } else if (score >= 0 && score < 2) {
        setSeverity("Medium");
      } else if (score < 0 && score >= -2) {
        setSeverity("High");
      } else {
        setSeverity("Very High");
      }
      setLoadingSentiment(false);
    } catch (error) {
      console.error("Error calculating sentiment:", error);
    }
  };
  const Handlesubmit = async (e, formData) => {
    e.preventDefault();

    // Check if required fields are filled
    if (
      formData.complaintType === "" ||
      formData.department === "" ||
      formData.date === "" ||
      formData.complaintDescription === "" ||
      formData.location === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      console.log(userId);
      const userCollectionRef = collection(db, "Users", userId, "Complaints");
      const docRef = await addDoc(userCollectionRef, formData);
      const complaintId = docRef.id;
      formData.complaint_id = complaintId;
      formData.Assign_to = "";
      formData.message = [];
      formData.status = "Active";
      // setComplaintDescription(data.complaintDescription);
      formData.name_of_employee = data.name_of_employee;
      formData.department_of_employee = data.department_of_employee;
      formData.email_of_employee = data.email_of_employee;
      formData.Anonymous = data.Anonymous;
      setLoadingSentiment(true);
      const sentiment = new Sentiment();
      const { score } = sentiment.analyze(formData.complaintDescription);
      // Determine severity level based on sentiment score
      if (score >= 2) {
        formData.severity = "Low";
      } else if (score >= 0 && score < 2) {
        formData.severity = "Medium";
      } else if (score < 0 && score >= -2) {
        formData.severity = "High";
      } else {
        formData.severity = "Very High";
      }

      const genAI = new GoogleGenerativeAI("AIzaSyBD49YmEANLMfDRoZVRMd4Dkay6vl-EVdo");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = formData.complaintDescription + " This is a complaint description raised by the client. Please provide a one-line suggestion to resolve the issue if it's negative, otherwise provide a positive one-liner.";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const suggestedSolution = response.text();
      formData.suggested_solution=suggestedSolution;


      await setDoc(doc(userCollectionRef, complaintId), formData);
      
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const adminUsers = users.filter(user => user.Role === "Admin");
        adminUsers.forEach(async (user) => {
          try {
            const admin_id = user.id; 
            const notificationData = {
              message: `A new complaint has been raised by User ID ${userId}`,
              timestamp: new Date(),
              isread: false,
              readat: null, 
            };
            const notificationsRef = collection(db, `Users/${admin_id}/Notifications`);
            await addDoc(notificationsRef, notificationData);
          } catch (error) {
            console.error("Error sending notification:", error);
          }
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }



      clear_form();
      navigate("/OTP/Dashboard");
      console.log("Form data added to Firebase successfully!");
    } catch (error) {
      console.error("Error adding form data to Firebase: ", error);
    }
  };

  const backgroundImageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const textbox_desc = {
    height: "100px",
  };

  const Formsttyle = {
    width: "100%",
    maxWidth: "650px",
    margin: "100px 0 100px 0",
    backgroundColor: "rgba(0, 0, 255, 0.5)",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "20px",
  };

  const buttonStyle = {
    backgroundColor: "black",
    color: "white",
    padding: "8px",
    width: "48%",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-400"
      style={backgroundImageStyle}
    >
      <form
        className="bg-white p-8 rounded shadow-md max-w-md"
        style={Formsttyle}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          What type of complaint Do you want to raise?
        </h2>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dropdown2"
          >
            Select Type of Complaint *
          </label>
          <select
            className="w-full px-4 py-2 border rounded-md appearance-none"
            id="dropdown2"
            name="complaintType"
            value={formData.complaintType}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="General feedback or questions">
              General feedback or questions
            </option>
            <option value="Culture issues">Culture issues</option>
            <option value="Diversity,equity and inclusion">
              Diversity,equity and inclusion
            </option>
            <option value="Performance and development">
              Performance and development
            </option>
            <option value="Compensation and benefits">
              Compensation and benefits
            </option>
            <option value="All hands Q&A">All hands Q&A</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dropdown1"
          >
            Which Department did this Happen in? *
          </label>
          <select
            className="w-full px-4 py-2 border rounded-md appearance-none"
            id="dropdown1"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="">Select Option</option>
            <option value="HR Department">HR Department</option>
            <option value="Frontend Department">Frontend Department</option>
            <option value="Backend Department">Backend Department</option>
            <option value="Design Department">Design Department</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateInput"
          >
            Select Date *
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-md appearance-none bg-white border-gray-300 focus:outline-none focus:border-blue-500"
            id="dateInput"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="complaintDescription"
          >
            Complaint Description *
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-md resize-none"
            id="complaintDescription"
            name="complaintDescription"
            value={formData.complaintDescription}
            onChange={handleInputChange}
            placeholder="Enter your complaint description"
            style={textbox_desc}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="feedbackType"
          >
            Location *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            id="feedbackType"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter Location"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="feedbackType"
          >
            Claim Raised Against
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            id="feedbackType"
            name="claimRaisedAgainst"
            value={formData.claimRaisedAgainst}
            onChange={handleInputChange}
            placeholder="Enter Name"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="feedbackType"
          >
            Any Victims Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            id="feedbackType"
            name="victimsName"
            value={formData.victimsName}
            onChange={handleInputChange}
            placeholder="Enter Name"
          />
        </div>

        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={Handleback}>
            Back
          </button>
          <button
            style={buttonStyle}
            onClick={(e) => Handlesubmit(e, formData)}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DropdownForm;
