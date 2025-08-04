import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaSearch, FaEye, FaEyeSlash } from "react-icons/fa";

const CreateUserPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    name: "",
    password: "",
    position: "User",
  });

  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState({});

  //  Fetch accounts from backend
  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/accounts");
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //  Add account
  const handleAdd = async () => {
    const { id, name, password, position } = form;

    if (!id || !name || !password || !position) {
      alert("Please fill out all fields before adding.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        setForm({ id: "", name: "", password: "", position: "User" });
        fetchAccounts();
      } else {
        alert(result.error || "Failed to add account");
      }
    } catch (err) {
      console.error(err);
    }
  };

  //  password visibility
  const togglePassword = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Enable / Disable account
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";

    try {
      const res = await fetch(`http://localhost:5000/api/accounts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        fetchAccounts(); 
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to toggle status", err);
      alert("Error updating status");
    }
  };

  // Search filter
  const filteredAccounts = accounts.filter((acc) =>
    Object.values(acc).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-background dashboard">
      {/* Button */}
      <div className="back-container">
        <button className="back-btn" onClick={() => navigate("/admin")}>
          ← Back
        </button>
      </div>

      {/* Header */}
      <h1 className="records-title">Create & Manage User Accounts</h1>

      {/* Row */}
      <div className="user-input-row">
        <input type="text" name="id" placeholder="User ID" value={form.id} onChange={handleChange} />
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <select name="position" value={form.position} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>

      {/* Search Bar */}
      <div className="user-search-container">
        <div className="user-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="records-grid-container full-width">
        <table className="records-grid">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Password</th>
              <th>Position</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc) => (
              <tr key={acc.id}>
                <td>{acc.id}</td>
                <td>{acc.name}</td>
                <td>
                  {visiblePasswords[acc.id] ? acc.password : "••••••"}
                  {visiblePasswords[acc.id] ? (
                    <FaEyeSlash onClick={() => togglePassword(acc.id)} title="Hide Password" />
                  ) : (
                    <FaEye onClick={() => togglePassword(acc.id)} title="Show Password" />
                  )}
                </td>
                <td>{acc.position}</td>
                <td>{acc.status}</td>
                <td>
  <button
    onClick={() => handleToggleStatus(acc.id, acc.status)}
    className={`btn-status ${acc.status === "ACTIVE" ? "active" : "disabled"}`}
  >
    {acc.status === "ACTIVE" ? "Disable" : "Enable"}
  </button>
</td>

              </tr>
            ))}
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No accounts found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="records-actions">
          <button className="btn-add" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
