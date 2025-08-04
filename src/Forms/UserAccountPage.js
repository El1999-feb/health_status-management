import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserAccountPage = () => {
  const [account, setAccount] = useState({
    id: "",
    name: "",
    position: "",
    password: ""
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); //  logged-in user's ID

  useEffect(() => {
    if (!userId) {
      alert("You are not logged in");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/currentuser/${userId}`)
      .then((res) => {
        setAccount({
          id: res.data.id,
          name: res.data.name,
          position: res.data.position,
          password: ""
        });
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [userId, navigate]);

  const handlePasswordUpdate = () => {
    if (!account.password.trim()) {
      alert("Password cannot be empty");
      return;
    }

    axios
      .put(`http://localhost:5000/api/currentuser/updatepassword/${account.id}`, {
        password: account.password
      })
      .then(() => {
        alert("Password updated successfully");
        setAccount((prev) => ({ ...prev, password: "" }));
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        alert("Failed to update password");
      });
  };

  return (
    <div className="admin-background dashboard">
      {/* Button */}
      <div className="back-container">
        <button className="back-btn" onClick={() => navigate("/user")}>
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Header */}
      <h1 className="records-title">My Account</h1>

      {/*  Row */}
      <div className="user-input-row">
        <input type="text" value={account.id} readOnly placeholder="User ID" />
        <input type="text" value={account.name} readOnly placeholder="Name" />
        <input
          type="password"
          placeholder="New Password"
          value={account.password}
          onChange={(e) =>
            setAccount((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <input type="text" value={account.position} readOnly placeholder="Position" />
      </div>

      {/* Buttons */}
      <div className="records-actions">
        <button className="btn-add" onClick={handlePasswordUpdate}>
          Update Password
        </button>
      </div>
    </div>
  );
};

export default UserAccountPage;
