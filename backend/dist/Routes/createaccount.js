"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Get accounts
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query("SELECT * FROM accounts");
        res.json(rows);
    }
    catch (err) {
        console.error("❌ Failed to fetch accounts:", err);
        res.status(500).json({ error: "Failed to fetch accounts" });
    }
}));
// Add account
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, password, position } = req.body;
    if (!id || !name || !password || !position) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        yield db_1.default.execute("INSERT INTO accounts (id, name, password, position, status) VALUES (?, ?, ?, ?, 'ACTIVE')", [id, name, password, position]);
        console.log(` Account added: ${id}`);
        res.json({ message: "Account created successfully" });
    }
    catch (err) {
        console.error(" Failed to add account:", err);
        res.status(500).json({ error: "Failed to add account" });
    }
}));
//  Update password
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }
    try {
        yield db_1.default.query("UPDATE accounts SET password = ? WHERE id = ?", [password, id]);
        console.log(` Password updated for ID: ${id}`);
        res.json({ message: "Password updated successfully" });
    }
    catch (err) {
        console.error(" Failed to update password:", err);
        res.status(500).json({ error: "Error updating password" });
    }
}));
// Enable / Disable account
router.put("/:id/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`🔍 Received request to update status for ID: ${id}, Status: ${status}`);
    if (!status || !["ACTIVE", "DISABLED"].includes(status)) {
        console.error(" Invalid status value:", status);
        return res.status(400).json({ error: "Invalid status" });
    }
    try {
        const [result] = yield db_1.default.query("UPDATE accounts SET status = ? WHERE id = ?", [status, id]);
        console.log(` Account status updated: ID=${id}, New Status=${status}`);
        res.json({ message: `Account ${status.toLowerCase()} successfully` });
    }
    catch (err) {
        console.error(" Failed to update status:", err);
        res.status(500).json({ error: "Error updating status" });
    }
}));
exports.default = router;
