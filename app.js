import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './config/dbconfig.js';
import routes from './routes/index.js'; // <-- ✅ importando as rotas centralizadas

// Models
import Tutor from './models/tutor.js';
import Follow from './models/users/follow.js';
import Pet from './models/pet.js';
import MedicalHistory from './models/MedicalHistory.js';
import Vaccination from './models/Vaccination.js';
import Comment from './models/posts/comment.js';
import Post from './models/posts/post.js';
import { PostLike, CommentLike } from './models/posts/postLike.js';
import Share from './models/posts/share.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Servir arquivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Rotas
app.use(routes);

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o Banco de Dados estabelecida com sucesso!');

    await Tutor.sync({ force: false, logging: console.log });
    await Follow.sync({ force: false, logging: console.log });

    await Post.sync({ force: false, logging: console.log });
    await Share.sync({ force: false, logging: console.log });

    await Pet.sync({ force: false, logging: console.log });
    await MedicalHistory.sync({ force: false, logging: console.log });
    await Vaccination.sync({ force: false, logging: console.log });

    await Comment.sync({ force: false, logging: console.log });
    await PostLike.sync({ force: false, logging: console.log });
    await CommentLike.sync({ force: false, logging: console.log });

    console.log('Tabelas criadas ou sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error.message);
    console.error(error);
  }
}

async function startServer() {
  await syncDatabase();
  app.listen(3000, () => {
    console.log('Servidor aberto na porta 3000');
  });
}

startServer();
