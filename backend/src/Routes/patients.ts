import express, { Request, Response } from "express";
import db from "../db";
import { RowDataPacket } from "mysql2/promise";

const router = express.Router();

// search patient
router.get("/", async (req: Request, res: Response) => {
  const search = req.query.search?.toString().toLowerCase();

  try {
    let query = "SELECT * FROM patients";
    const values: any[] = [];

    if (search) {
      query += " WHERE LOWER(CONCAT(id, name, address, gender, bp, status)) LIKE ?";
      values.push(`%${search}%`);
    }

    const [rows] = await db.execute<RowDataPacket[]>(query, values);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Failed to fetch patients." });
  }
});


router.post("/", async (req: Request, res: Response) => {
  const { id, name, address, gender, bp, status } = req.body;

  try {
    const [existing] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM patients WHERE id = ?",
      [id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Patient already exists" });
    }
// add patient
    await db.execute(
      "INSERT INTO patients (id, name, address, gender, bp, status) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, address, gender, bp, status]
    );

    res.json({ message: "Patient added successfully" });
  } catch (err) {
    console.error("Error adding patient:", err);
    res.status(500).json({ error: "Failed to add patient." });
  }
});


router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, address, gender, bp, status } = req.body;

  try {
    await db.execute(
      "UPDATE patients SET name = ?, address = ?, gender = ?, bp = ?, status = ? WHERE id = ?",
      [name, address, gender, bp, status, id]
    );

    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).json({ error: "Failed to update patient." });
  }
});

// delete patient
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM patients WHERE id = ?", [id]);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("Error deleting patient:", err);
    res.status(500).json({ error: "Failed to delete patient." });
  }
});

export default router;
