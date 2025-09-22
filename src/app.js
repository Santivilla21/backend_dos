import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());//antes de las rutas para poder leer el json en postman

app.use('/carts', cartRoutes);
app.use('/usuarios', userRoutes);

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/products.routes.js';
import Product from './models/Product.js';
import cartRoutes from './routes/carts.routes.js';


import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import http from 'http';
import { Server as SocketIO } from 'socket.io';
const server = http.createServer(app);
const PORT = 8080;
// Crear instancia de socket.io
const io = new SocketIO(server);
// Escuchar eventos de conexión
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado por Socket.io:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Resto de configuración
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import viewsRoutes from './routes/views.routes.js';
app.use('/', viewsRoutes); // esto hará que '/' sirva la vista con Handlebars

// Conexión a MongoDB
mongoose.connect('mongodb+srv://patisanti123:coderhouse@cluster0.otmadey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Importar modelo

// Ruta de prueba
app.get('/products', async (req, res) => {
  const productos = await Product.find();
  res.json(productos);
});


app.post('/products', async (req, res) => {
  const nuevoProducto = new Product(req.body);
  await nuevoProducto.save();
  res.status(201).json(nuevoProducto);
});
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
