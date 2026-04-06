import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import recordRoutes from "./src/routes/records.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.json({message:"Finance Dashboard API runninggg"});
});

//routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/records",recordRoutes);
app.use("/api/dashboard",dashboardRoutes);

//404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


