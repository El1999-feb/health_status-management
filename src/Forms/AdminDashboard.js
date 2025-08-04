import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaUserPlus, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="admin-background dashboard">
      <h1 className="dashboard-title">ADMIN DASHBOARD</h1>
      <p className="dashboard-subtitle">Select an option below </p>

      <div className="dashboard-panels">  
      <div className="dashboard-card" onClick={() => navigate("/records")}>
        <FaClipboardList size={50} color="" />
         <h2>Manage Patients / Records</h2>
         <p>Add, search, update, and delete patient data.</p>
      </div>

        <div className="dashboard-card" onClick={() => navigate("/create-user")}>
          <FaUserPlus size={50} color="" />
          <h2>Create User Account</h2>
          <p>Register new admin or user accounts.</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
