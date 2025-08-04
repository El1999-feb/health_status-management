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
// ✅ POST /api/login
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const [rows] = yield db_1.default.execute("SELECT * FROM accounts WHERE id = ? AND BINARY password = ? AND LOWER(position) = LOWER(?)", [id, password, position]);
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
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
}));
exports.default = router;
