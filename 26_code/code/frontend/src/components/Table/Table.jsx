import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";

const makeStyle = (status) => {
  if (status === "Resolved") {
    return {
      background: "rgb(145 254 159 / 97%)",
      color: "green",
    };
  } else if (status === "Pending") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else {
    return {
      background: "#59bfff",
      color: "white",
    };
  }
};

const BasicTable = ({ complaints }) => {
  const [comp, setComplaints] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
      } else {
        navigate("/");
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
      const querySnapshot = await getDocs(
        collection(db, "Users", userId, "Complaints")
      );
      const complaintList = querySnapshot.docs.map((doc) => doc.data());
      setComplaints(complaintList);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleView = (id) => {
    localStorage.setItem('complaint_id', id);
    navigate('/OTP/Dashboard/AllComplaints/one_complaint');
  }

  return (
    <div className="Table">
      <h3
        style={{
          marginBottom: "20px",
          textAlign: "center",
          color: "#333",
          fontFamily: "Arial, sans-serif",
          fontSize: "24px",
          textTransform: "uppercase",
        }}
      >
        Recent Complaints
      </h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
          }}
        >
          <TableHead style={{ backgroundColor: "#4CAF50", color: "white" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>
                Complaint Type
              </TableCell>
              <TableCell align="left" style={{ fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell align="left" style={{ fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell align="left" style={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints &&
              complaints.map((row) => (
                <TableRow
                  key={row.complaint_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.complaintType}
                  </TableCell>
                  <TableCell align="left">{row.complaint_id}</TableCell>
                  <TableCell align="left">{row.date}</TableCell>
                  <TableCell align="left">
                    <span className="status" style={makeStyle(row.status)}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell
                    align="left"
                    className="Details"
                    style={{
                      color: "#ffadad8f", // Text color
                      cursor: "pointer", // Cursor style
                      fontWeight: "bold", // Font weight
                      padding: "8px 16px", // Padding
                      borderRadius: "4px", // Border radius
                    }}
                    onClick={() => handleView(row.complaint_id)}
                  >
                    Details
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BasicTable;
