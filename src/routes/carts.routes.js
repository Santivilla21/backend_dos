import { Router } from 'express';
import Cart from '../models/Carts.js';
import Product from '../models/Product.js';

const router = Router();

// Crear un nuevo carrito vacío
router.post('/', async (req, res) => {
  const nuevo = new Cart({ usuarioId: req.body.usuarioId, productos: [] });
  await nuevo.save();
  res.status(201).json(nuevo);
});

// Obtener un carrito (por ID)
router.get('/:cid', async (req, res) => {
  const carrito = await Cart.findById(req.params.cid).populate('productos.productoId');
  carrito ? res.json(carrito) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const carrito = await Cart.findById(cid);
  if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

  const productoIndex = carrito.productos.findIndex(p => p.productoId.equals(pid));

  if (productoIndex >= 0) {
    carrito.productos[productoIndex].cantidad += 1;
  } else {
    carrito.productos.push({ productoId: pid, cantidad: 1 });
  }

  await carrito.save();
  res.json(carrito);
});

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const carrito = await Cart.findById(cid);
  if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

  carrito.productos = carrito.productos.filter(p => !p.productoId.equals(pid));
  await carrito.save();
  res.json(carrito);
});

// Vaciar todo el carrito
router.delete('/:cid', async (req, res) => {
  const carrito = await Cart.findById(req.params.cid);
  if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

  carrito.productos = [];
  await carrito.save();
  res.json({ mensaje: 'Carrito vaciado' });
});

export default router;
