import express, { Request, Response } from "express";
import db from "../db";
import { RowDataPacket } from "mysql2";

const router = express.Router();

// Get current user details by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, name, position FROM accounts WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//  Update onlypassword 
router.put("/updatepassword/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    await db.query("UPDATE accounts SET password = ? WHERE id = ?", [password, id]);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update password" });
  }
});

export default router;
