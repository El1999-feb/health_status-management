"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const createaccount_1 = __importDefault(require("./Routes/createaccount"));
const patients_1 = __importDefault(require("./Routes/patients"));
const login_1 = __importDefault(require("./Routes/login"));
const userpatients_1 = __importDefault(require("./Routes/userpatients"));
const userupdateaccounts_1 = __importDefault(require("./Routes/userupdateaccounts"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/accounts", createaccount_1.default);
app.use("/api/patients", patients_1.default);
app.use("/api/login", login_1.default);
app.use("/api/patients", userpatients_1.default);
app.use("/api/currentuser", userupdateaccounts_1.default);
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
