import express, { Request, Response } from "express";
import db from "../db";  
import { RowDataPacket } from "mysql2";

const router = express.Router();

// search patient
router.get("/", async (req, res) => {
  const search = req.query.search?.toString().toLowerCase();
  try {
    let query = "SELECT * FROM patients";
    let values: any[] = [];

    if (search) {
      query += " WHERE LOWER(CONCAT(id, name, address, gender, bp, status)) LIKE ?";
      values.push(`%${search}%`);
    }

    const [rows]: any = await db.execute(query, values);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});


router.post("/", async (req, res) => {
  const { id, name, address, gender, bp, status } = req.body;
  try {
    const [existing]: any = await db.execute("SELECT * FROM patients WHERE id = ?", [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Patient already exists" });
    }

    await db.execute(
      "INSERT INTO patients (id, name, address, gender, bp, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, address, gender, bp, status]
    );

    res.json({ message: "Patient added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add patient." });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, gender, bp, status } = req.body;
  try {
    await db.execute(
      "UPDATE patients SET name=?, address=?, gender=?, bp=?, status=? WHERE id=?",
      [name, address, gender, bp, status, id]
    );
    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update patient." });
  }
});

export default router;
