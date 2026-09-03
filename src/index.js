import express from 'express';
import morgan from 'morgan';
import { PORT } from './config.js';
import { connectDatabase } from './db.js';
import { connectOrm } from './sequelize.js';
import './models/index.js';
import userRoutes from './routes/users.routes.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.get('/', (_req, res) => res.json({ message: 'API ABP7 funcionando' }));
app.use(userRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === '23505' || error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ message: 'El email ya está registrado' });
  if (error.code === '23503' || error.name === 'SequelizeForeignKeyConstraintError') return res.status(409).json({ message: 'La operación viola una relación existente' });
  res.status(500).json({ message: 'Error interno del servidor' });
});

async function start() {
  try {
    await connectDatabase();
    await connectOrm();
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

start();
