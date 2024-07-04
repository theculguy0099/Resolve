import { useEffect, useState } from 'react';
import { collection, getDoc, doc , query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';



const Role_of_person = () => {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid); // Set userId using setUserId
            } else {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    useEffect(() => {
        if (userId) {
            getUserRole(userId);
        }
    }
    , [userId]);

    const getUserRole = async (userId) => {
        try {
            // const usersSnapshot = await getDocs(collection(db, "Users"));
            const userRef = doc(db, "Users", userId); // Fetch the document snapshot for the specific user
            const userSnapshot = await getDoc(userRef);
            setUserRole(userSnapshot.data().Role)
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    }

    
    return userRole;
};

export default Role_of_person;
