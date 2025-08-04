import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { FaSearch } from "react-icons/fa";

const RecordPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id: "",
    name: "",
    address: "",
    gender: "Select Gender",
    bp: "",
    status: "Select Status",
  });

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients");
      const data = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        fetchPatients();
        setForm({ id: "", name: "", address: "", gender: "Male", bp: "", status: "Normal" });
        setSelectedId(null);
      }
    } catch (error) {
      console.error("Failed to add patient", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        fetchPatients();
        setForm({ id: "", name: "", address: "", gender: "Male", bp: "", status: "Normal" });
        setSelectedId(null);
      }
    } catch (error) {
      console.error("Failed to update patient", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/patients/${selectedId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPatients();
        setForm({ id: "", name: "", address: "", gender: "Male", bp: "", status: "Normal" });
        setSelectedId(null);
      }
    } catch (error) {
      console.error("Failed to delete patient", error);
    }
  };

  const handleRowClick = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      address: p.address,
      gender: p.gender,
      bp: p.bp,
      status: p.status,
    });
    setSelectedId(p.id);
  };

  const filteredPatients = patients.filter((p) =>
    Object.values(p).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-background dashboard">
      <div className="back-container">
        <button className="back-btn" onClick={() => navigate("/admin")}>← Back</button>
      </div>

      <h1 className="records-title">Manage Patient Records</h1>

      <div className="records-layout">
        <div className="records-form">
          <h2>Patient Details</h2>
          <input type="text" name="id" placeholder="Patient ID" value={form.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="text" name="bp" placeholder="BP (120/80)" value={form.bp} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Normal">Normal</option>
            <option value="Highblood">Highblood</option>
            <option value="Anemic">Anemic</option>
          </select>
        </div>

        <div className="records-grid-container">
          <h2>Patient Records</h2>

          <div className="user-search-container">
            <div className="user-search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ maxHeight: "350px", overflowY: "auto", marginBottom: "10px" }}>
            <table className="records-grid">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>BP</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => handleRowClick(p)}
                      style={{ backgroundColor: selectedId === p.id ? "#f0f0f0" : "transparent" }}
                    >
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.address}</td>
                      <td>{p.gender}</td>
                      <td>{p.bp}</td>
                      <td>{p.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="records-actions">
            <button className="btn-add" onClick={handleAdd}>Add</button>
            <button className="btn-update" onClick={handleUpdate}>Update</button>
            <button className="btn-delete" onClick={handleDelete}>Delete</button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordPage;
