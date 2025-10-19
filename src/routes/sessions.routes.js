// sessions.routes.js
import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import bcrypt from 'bcrypt';

dotenv.config();

const router = Router();

// 🧩 Registrar usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const userExistente = await User.findOne({ email });
    if (userExistente)
      return res.status(401).json({ message: 'El usuario ya existe' });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const nuevoUsuario = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error });
  }
});

// 🔑 Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(400).json({ message: 'Usuario no encontrado' });

    const esValida = bcrypt.compareSync(password, usuario.password);
    if (!esValida)
      return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        first_name: usuario.first_name,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Guardar token en cookie
    res.cookie('cookieToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el login', error });
  }
});

// 👤 Ruta protegida: /current
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    res.json({
      message: 'Usuario autenticado correctamente',
      user: req.user,
    });
  }
);

export default router;
