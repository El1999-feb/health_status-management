import express from "express";
import cors from "cors";
import accountRoutes from "./Routes/createaccount";
import patientRoutes from "./Routes/patients";
import loginRoutes from "./Routes/login";
import userPatientRoutes from "./Routes/userpatients";
import userUpdateAccountRoutes from "./Routes/userupdateaccounts";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/accounts", accountRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/patients", userPatientRoutes);
app.use("/api/currentuser", userUpdateAccountRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
