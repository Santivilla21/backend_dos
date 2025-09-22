import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const nuevoUsuario = new User({ nombre, email });
    await nuevoUsuario.save();

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'No se pudo crear el usuario', detalle: err.message });
  }
});

export default router;
