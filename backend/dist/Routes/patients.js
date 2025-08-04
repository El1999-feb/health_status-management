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
// search patient
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
    try {
        let query = "SELECT * FROM patients";
        const values = [];
        if (search) {
            query += " WHERE LOWER(CONCAT(id, name, address, gender, bp, status)) LIKE ?";
            values.push(`%${search}%`);
        }
        const [rows] = yield db_1.default.execute(query, values);
        res.json(rows);
    }
    catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).json({ error: "Failed to fetch patients." });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, address, gender, bp, status } = req.body;
    try {
        const [existing] = yield db_1.default.execute("SELECT * FROM patients WHERE id = ?", [id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Patient already exists" });
        }
        // add patient
        yield db_1.default.execute("INSERT INTO patients (id, name, address, gender, bp, status) VALUES (?, ?, ?, ?, ?, ?)", [id, name, address, gender, bp, status]);
        res.json({ message: "Patient added successfully" });
    }
    catch (err) {
        console.error("Error adding patient:", err);
        res.status(500).json({ error: "Failed to add patient." });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, address, gender, bp, status } = req.body;
    try {
        yield db_1.default.execute("UPDATE patients SET name = ?, address = ?, gender = ?, bp = ?, status = ? WHERE id = ?", [name, address, gender, bp, status, id]);
        res.json({ message: "Patient updated successfully" });
    }
    catch (err) {
        console.error("Error updating patient:", err);
        res.status(500).json({ error: "Failed to update patient." });
    }
}));
// delete patient
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.execute("DELETE FROM patients WHERE id = ?", [id]);
        res.json({ message: "Patient deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting patient:", err);
        res.status(500).json({ error: "Failed to delete patient." });
    }
}));
exports.default = router;
