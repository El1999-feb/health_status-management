import express, { Request, Response } from "express";
import db from "../db"; 
import { RowDataPacket } from "mysql2";

const router = express.Router();

// Get accounts
router.get("/", async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM accounts");
    res.json(rows);
  } catch (err) {
    console.error("❌ Failed to fetch accounts:", err);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

// Add account
router.post("/", async (req: Request, res: Response) => {
  const { id, name, password, position } = req.body;

  if (!id || !name || !password || !position) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "INSERT INTO accounts (id, name, password, position, status) VALUES (?, ?, ?, ?, 'ACTIVE')",
      [id, name, password, position]
    );
    console.log(` Account added: ${id}`);
    res.json({ message: "Account created successfully" });
  } catch (err) {
    console.error(" Failed to add account:", err);
    res.status(500).json({ error: "Failed to add account" });
  }
});

//  Update password
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    await db.query("UPDATE accounts SET password = ? WHERE id = ?", [password, id]);
    console.log(` Password updated for ID: ${id}`);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(" Failed to update password:", err);
    res.status(500).json({ error: "Error updating password" });
  }
});

// Enable / Disable account
router.put("/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`🔍 Received request to update status for ID: ${id}, Status: ${status}`);

  if (!status || !["ACTIVE", "DISABLED"].includes(status)) {
    console.error(" Invalid status value:", status);
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const [result] = await db.query("UPDATE accounts SET status = ? WHERE id = ?", [status, id]);
    console.log(` Account status updated: ID=${id}, New Status=${status}`);
    res.json({ message: `Account ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(" Failed to update status:", err);
    res.status(500).json({ error: "Error updating status" });
  }
});

export default router;
