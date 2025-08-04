import express, { Request, Response } from "express";
import db from "../db";
import { RowDataPacket } from "mysql2";

const router = express.Router();

// ✅ POST /api/login
router.post("/", async (req: Request, res: Response) => {
  const { id, password, position } = req.body;

  if (!id || !password || !position) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ✅ Hardcoded Super Admin check (ignore position)
    if (id === "202" && password === "superadmin") {
      return res.json({
        user: {
          id: "202",
          name: "Super Admin",
          position: "Admin", // Hardcoded as Admin
          status: "ACTIVE"
        }
      });
    }

    // ✅ Normal user check from DB
   const [rows] = await db.execute<RowDataPacket[]>(
  "SELECT * FROM accounts WHERE id = ? AND BINARY password = ? AND LOWER(position) = LOWER(?)",
  [id, password, position]
);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials or wrong password" });
    }

    const user = rows[0];

    // ✅ Check if account is disabled
    if (user.status === "DISABLED") {
      return res.status(403).json({ error: "Your account is disabled. Contact admin." });
    }

    // ✅ Return user info
    res.json({
      user: {
        id: user.id,
        name: user.name,
        position: user.position,
        status: user.status
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
