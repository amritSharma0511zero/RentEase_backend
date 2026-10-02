import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/db.js";
import cookieParser from "cookie-parser";
import healthRoute from "./routes/healthRoute.js";
import cors from "cors";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoute from "./routes/authRoutes.js";
import propertyRoute from "./routes/propertyRoutes.js";
import adminPropertyRoute from "./routes/adminPropertyRoutes.js";
import notificationRoute from "./routes/notificationRoutes.js";
import adminUserRoute from "./routes/adminUserRoutes.js";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/health", healthRoute);
app.use("/api/auth", authRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/admin/properties", adminPropertyRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/admin/users", adminUserRoute);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RentEase API is running",
  });
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`Server running at port ${PORT}`);
});
