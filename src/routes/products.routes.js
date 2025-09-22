import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

export default (io) => {
  // GET todos los productos
  router.get('/products', async (req, res) => {
    const productos = await Product.find();
    res.json(productos);
  });

  // GET por ID
  router.get('/products/:id', async (req, res) => {
    const producto = await Product.findById(req.params.id);
    producto ? res.json(producto) : res.status(404).json({ error: 'Producto no encontrado' });
  });

  // POST nuevo producto
  router.post('/products', async (req, res) => {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save();

    io.emit('producto-nuevo', nuevoProducto); // <- ya podés usar io

    res.status(201).json(nuevoProducto);
  });

  // PUT actualizar producto sin websocket
  /* router.put('/products/:id', async (req, res) => {
    const actualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    actualizado ? res.json(actualizado) : res.status(404).json({ error: 'Producto no encontrado' });
  });
 */
//con websocket
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const productoActualizado = await Product.findByIdAndUpdate(id, data, { new: true });
  io.emit('producto-actualizado', productoActualizado);
  res.json(productoActualizado);
});
  // DELETE eliminar producto sin websocket
/*   router.delete('/products/:id', async (req, res) => {
    const eliminado = await Product.findByIdAndDelete(req.params.id);
    eliminado ? res.json({ mensaje: 'Eliminado' }) : res.status(404).json({ error: 'Producto no encontrado' });
  });
 */
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const eliminado = await Product.findByIdAndDelete(id);
    io.emit('producto-eliminado', eliminado._id);
    res.json({ mensaje: 'Producto eliminado', id: eliminado._id });
  });
  
  return router;
};
