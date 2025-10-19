// src/config/passport.js
import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from '../models/User.model.js';
import dotenv from 'dotenv';
dotenv.config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// --- Extractor personalizado: busca el token en cookies ---
const buscarToken = (req) => {
  let token = null;
  if (req && req.cookies && req.cookies.cookieToken) {
    token = req.cookies.cookieToken; // nombre de cookie que guarda tu JWT
  }
  return token;
};

// --- Inicializador de Passport ---
export const iniciarPassport = () => {
  // Estrategia "current" para validar el JWT desde cookie
  passport.use(
    'current',
    new JWTStrategy(
      {
        secretOrKey: process.env.JWT_SECRET || 'CoderCoder123',
        jwtFromRequest: ExtractJWT.fromExtractors([buscarToken]),
      },
      async (contenidoToken, done) => {
        try {
          // contenidoToken = payload original del JWT (ej: { sub, email, role, ... })

          // Validar usuario desde la base de datos (opcional pero recomendado)
          const user = await User.findById(contenidoToken.sub).select('-password');

          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado o token inválido' });
          }

          // Ejemplo de bloqueo temporal por nombre (como en tu ejemplo)
          if (user.first_name === 'Martin') {
            return done(null, false, {
              message: 'El usuario Martin tiene el acceso temporalmente inhabilitado. Contacte a RRHH.',
            });
          }

          // OK → se pasa el usuario al controlador
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
