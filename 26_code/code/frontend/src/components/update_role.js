
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import backgroundImage from './b_im_2.jpg';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";

const UpdateRole = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
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
      getUsers();
    }
  }, [userId]);

  const getUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (roleId, user_id) => {
    setUsers(users.map(user => {
      if (user.UID === user_id) {
        return { ...user, Role: roleId };
      }
      return user;
    }));
  };

  const handleRoleChange = async (user_id, selected_role) => {
    try {
      await updateDoc(doc(db, "Users", user_id), {
        Role: selected_role
      });
      setUsers(users.map(user => {
        if (user.UID === user_id) {
          return { ...user, Role: selected_role };
        }
        return user;
      }));
    } catch (error) {
      console.error("Error updating role:", error);
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

  return (
    <div className="p-4 bg-gray-100" style={backgroundImageStyle}>
      <div className="w-full md:w-2/3 lg:w-3/4 xl:w-2/3 mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300">User ID</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Name</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Role</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Select Role</th>
                <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>

              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.UID} className="hover:bg-gray-200 transition duration-300">
                  <td className="px-6 py-4 border-b">{user.UID}</td>
                  <td className="px-6 py-4 border-b">{user.Name}</td>
                  <td className="px-6 py-4 border-b">{user.Role}</td>
                  <td className="px-6 py-4 border-b">
                    <select
                      className="w-full px-4 py-2 border rounded-md"
                      onChange={(e) => handleChange(e.target.value, user.UID)}
                      value={user.Role}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Mediator">Mediator</option>
                      <option value="Employee">Employee</option>
                    </select>
                    
                  </td>
                  
                  <td className="px-6 py-4 border-b">
                    <button
                      className="px-4 py-2 bg-gray-800 text-white rounded-md"
                      onClick={() => handleRoleChange(user.UID, user.Role)}
                    >
                      Save Changes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md" onClick={() => navigate('/OTP/Dashboard/')}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRole;

