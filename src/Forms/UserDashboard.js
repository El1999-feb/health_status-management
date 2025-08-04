import React from "react";
import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaUserEdit } from "react-icons/fa";
import "../App.css";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); 
  };

  return (
    <div className="admin-background dashboard">
      
      

      {/* Dashboard Header */}
      <h1>User Dashboard</h1>
      <p>Select and option below.</p>

      {/* Two Panels */}
      <div className="dashboard-grid">
        {/* Manage Patient Records */}
        <div className="dashboard-card" onClick={() => navigate("/user-records")}>
          <FaClipboardList className="dashboard-icon" />
          <h2>Manage Patient Records</h2>
          <p>Add, Search, and Update patient records.</p>
        </div>

        {/* Manage Account */}
        <div className="dashboard-card" onClick={() => navigate("/user-account")}>
          <FaUserEdit className="dashboard-icon" />
          <h2>Update Your Account</h2>
          <p>Update your account password</p>
        </div>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;

