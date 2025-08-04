import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    password: "",
    position: "User", // Default
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { id, password, position } = form;

    if (!id || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password, position }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // ✅ Check if account is disabled
        if (data.user.status === "DISABLED") {
          alert("Your account is disabled. Contact admin.");
          return;
        }

        alert("Login successful!");

        // ✅ Save user session in localStorage
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));

        // ✅ Handle navigation based on position
        const userPosition = data.user.position.toLowerCase();

        if (id === "202" && password === "superadmin") {
          // Hardcoded Super Admin goes to admin dashboard
          navigate("/admin");
        } else if (userPosition === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error, please try again later");
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h2>Health Status Manangement</h2>
        <input
          type="text"
          name="id"
          placeholder="User ID"
          value={form.id}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <select name="position" value={form.position} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
