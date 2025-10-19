// ---------- IMPORTACIONES PRINCIPALES ----------
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { iniciarPassport } from './config/passport.js';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import { engine } from 'express-handlebars';
import dotenv from 'dotenv';
dotenv.config();

// rutas
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/carts.routes.js';
import viewsRoutes from './routes/views.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
const PORT = process.env.PORT || 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// passport
iniciarPassport();
app.use(passport.initialize()); 

// handlebars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// socket io
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado por Socket.io:', socket.id);

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
});


app.use('/', viewsRoutes);
app.use('/usuarios', userRoutes);
app.use('/carts', cartRoutes);
app.use('/api/sessions', sessionsRoutes); 

// mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));


server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
