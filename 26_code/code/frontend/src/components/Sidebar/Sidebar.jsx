import React, { useState } from "react";
import Logo from "../imgs/logo.png";
import "./Sidebar.css";
// import { SidebarData } from "../Data/Data";
import yourcomponent  from "../Data/Data_sidebar";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Dialog, DialogContent, colors } from "@mui/material";
import { collection, query, orderBy, getDocs ,deleteDoc ,writeBatch,where} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { BsFillBellFill, BsBell } from 'react-icons/bs';

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notification_open, set_notification_menu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notification_alert, setnotification_alert] = useState(false);
  // const [Sidebardata,setbardata] = useState(null);

  const Sidebardata=yourcomponent();
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const Sidebardata_1 = await yourcomponent();
  //     setbardata(Sidebardata_1)
  //     // console.log(Sidebardata);
  //   };
  //   fetchData();
  // }, []);

  //  const Sidebardata = yourcomponent()

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

  const handle_notification_open = () => {
    set_notification_menu(true);
  };


  const update_isread = () => {
    setHasUnreadNotifications(false);
    try {
      // Replace 'YOUR_USER_ID' with the actual user ID
      const notificationsRef = collection(db, `Users/${userId}/Notifications`);
      const notificationsQuery = query(notificationsRef, where('isread', '==', false));
  
      getDocs(notificationsQuery).then(querySnapshot => {
        const batch = writeBatch(db);
        const currentTime = new Date();
  
        querySnapshot.forEach(doc => {
          batch.update(doc.ref, { isread: true, readat: currentTime });
        });
  
        batch.commit().then(() => {
          console.log("Unread notifications marked as read and updated readat field.");
        }).catch(error => {
          console.error("Error committing batch write:", error);
        });
      }).catch(error => {
        console.error("Error fetching notifications:", error);
      });
    } catch (error) {
      console.error("Error updating notification isread field:", error);
    }
  };

  const handle_notification_close = () => {
    set_notification_menu(false);
    update_isread();

  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
    navigate('/');
  }
const handle_unread_alertDialogClose = () => {
    setnotification_alert(false);
  };

  const fetchNotifications = async () => {
    const notificationsRef = collection(db, `Users/${userId}/Notifications`);
    const notificationsQuery = query(notificationsRef, orderBy('timestamp', 'desc'));
  
    try {
      const querySnapshot = await getDocs(notificationsQuery);
      const notificationsData = querySnapshot.docs.map(doc => {
        const notification = doc.data();
        // Check if isread field is true and notification timestamp is more than 1 day ago
        if (notification.isread && (Date.now() - notification.readat.toMillis()) > (1 * 24 * 60 * 60 * 1000)) {
          // Delete the document from Firestore
          deleteDoc(doc.ref);
          return null; // Exclude this notification from the data list
        } else {
          return notification; // Include this notification in the data list
        }
      }).filter(notification => notification !== null); // Filter out null notifications
  
      setNotifications(notificationsData);
      const hasUnread = notificationsData.some(notification => !notification.isread);
      setHasUnreadNotifications(hasUnread);
      setnotification_alert(hasUnread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userId){
      fetchNotifications();
    }
    
  }, [userId]);


  function formatTimestamp(timestamp) {
    if (timestamp && timestamp.toDate instanceof Function) {
      const date = timestamp.toDate();
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } else {
      return "Invalid Timestamp";
    }
  }

  return (
    <div className={isOpen ? "sidebar open" : "sidebar"}>
      <div className="bars" onClick={toggleMenu}>
        <span>&#9776;</span>
      </div>
      <div className="logo">
        <img src={Logo} alt="" />
        <span>RESOLVE</span>
      </div>
     
      {Sidebardata ? (
      <div className="menu">  
        {Sidebardata.map((item, index) => {
          return (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => {setSelected(index);navigate(item.path)}}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          );
        })}
        <div className="menuItem">
          {hasUnreadNotifications ? (
            <BsFillBellFill color="blue" size={24} onClick={handle_notification_open} style={{ cursor: 'pointer' }} />
          ) : (
            <BsBell onClick={handle_notification_open} size={24} style={{ cursor: 'pointer'}} />
          )}
          <span onClick={handle_notification_open} style={{ cursor: 'pointer' }}>Notifications</span>
        </div>
        <div className="menuItem">
          <UilSignOutAlt />
          <span onClick={handleLogout}>Logout</span>
        </div>
      </div>
    ) : (
      <p>Loading Sidebar...</p>
    )}

      <Dialog open={notification_open} onClose={handle_notification_close}>
  <DialogContent className="notification-dialog-content" >
    <div className="notification-header">
      <h2 className="notification-title">Notifications</h2>
      <button onClick={handle_notification_close} className="notification-close-button">
        Close
      </button>
    </div>
    <div className="notification-list">
      {notifications.map((notification, index) => (
        <div key={index} className="notification-item">
          <p className="notification-message">{notification.message}</p>
          <p className="notification-timestamp" >{formatTimestamp(notification.timestamp)}</p>
        </div>
      ))}
    </div>
  </DialogContent>
</Dialog>
{notification_alert && (
  <Dialog open={true} onClose={handle_unread_alertDialogClose}>
    <DialogContent>
      <p style={{color: 'blue'}}>You have new unread Notifications</p>
    </DialogContent>
  </Dialog>
)}

    </div>
  );
};

export default Sidebar;
