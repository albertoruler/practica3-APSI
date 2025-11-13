import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDB } from "./models/db";
import authRoutes from "./routes/auth";
import comicRoutes from "./routes/comicsRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // Para leer req.body en JSON

// Función para arrancar el servidor
const startServer = async () => {
  try {
    await connectToDB();
    console.log("Connected to MongoDB");

    // Rutas
    app.use("/auth", authRoutes);
    app.use("/comics", comicRoutes);

    // Ruta raíz
    app.get("/", (req, res) => {
      res.json({ message: "API ComicVault funcionando" });
    });

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

startServer();