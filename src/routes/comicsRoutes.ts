import { Router } from "express";
import { AuthRequest, authenticate } from "../middleware/auth";
import {
  createComic,
  getComicsByUser,
  getComicById,
  updateComic,
  deleteComic,
} from "../models/comic";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /comics → listar cómics del usuario
router.get("/", async (req: AuthRequest, res) => {
  try {
    const comics = await getComicsByUser(req.user.userId);
    res.json(comics);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cómics", error });
  }
});

// POST /comics → crear nuevo cómic
router.post("/", async (req: AuthRequest, res) => {
  const { title, author, year, publisher, status } = req.body;
  if (!title || !author || !year) return res.status(400).json({ message: "Faltan datos obligatorios" });

  try {
    const result = await createComic({
      title,
      author,
      year,
      publisher,
      status: status || "pendiente",
      userId: req.user.userId,
    });
    res.json({ message: "Cómic creado correctamente", comicId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear cómic", error });
  }
});

// PUT /comics/:id → actualizar cómic
router.put("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const comic = await getComicById(id, req.user.userId);
    if (!comic) return res.status(404).json({ message: "Cómic no encontrado" });

    await updateComic(id, req.user.userId, data);
    res.json({ message: "Cómic actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cómic", error });
  }
});

// DELETE /comics/:id → eliminar cómic
router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const comic = await getComicById(id, req.user.userId);
    if (!comic) return res.status(404).json({ message: "Cómic no encontrado" });

    await deleteComic(id, req.user.userId);
    res.json({ message: "Cómic eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cómic", error });
  }
});

export default router;