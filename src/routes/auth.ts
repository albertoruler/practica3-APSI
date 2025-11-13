import { Router, Request, Response } from "express";
import { db } from "../models/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// Registro de usuario
router.post("/register", async (req: Request, res: Response) => {
  const usersCollection = db.collection("users");
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Faltan datos" });

  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) return res.status(400).json({ message: "Usuario ya existe" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ username, password: hashedPassword });

  res.json({ message: "Usuario registrado correctamente" });
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const usersCollection = db.collection("users");
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Faltan datos" });

  const user = await usersCollection.findOne({ username });
  if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  res.json({ token });
});

export default router;