import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Forms/LoginPage";
import AdminDashboard from "./Forms/AdminDashboard";
import UserDashboard from "./Forms/UserDashboard";
import RecordsPage from "./Forms/RecordsPage";
import CreateUserPage from "./Forms/CreateUserPage";
import UserRecordPage from "./Forms/UserRecordPage";
import UserAccountPage from "./Forms/UserAccountPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route path="/user-records" element={<UserRecordPage />} />
        <Route path="/user-account" element={<UserAccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;