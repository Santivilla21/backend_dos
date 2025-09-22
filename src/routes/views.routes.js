import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// Ruta principal que muestra los productos con Handlebars
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find().lean(); // .lean() es necesario para que funcione con Handlebars

    res.render('home', {
      title: 'Lista de Productos',
      productos, // esto es lo que usás en la plantilla
    });
  } catch (error) {
    res.status(500).send('Error al cargar los productos');
  }
});

export default router;

