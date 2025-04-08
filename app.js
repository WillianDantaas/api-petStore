import express, { json, urlencoded } from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import sequelize from './config/dbconfig.js';  // Conexão do Sequelize
dotenv.config();

//Tutors Routes
import authRoutes from './routes/authRoutes.js';
import passRouter from './routes/passRouter.js';
import tutorLocation from './routes/tutorLocation.js';

//Posts Routes
import postsRoutes from './routes/posts/postsRoutes.js'

// Pets Routes
import petRoutes from './routes/pets/petRoutes.js';
import alertPets from './routes/pets/alertPets.js';

//FollowRoutes
import followRouter from './routes/follow/followRoutes.js';

// Pets Screen
import vaccinationRoutes from './routes/vaccinationRoutes.js';
import medicalHistoryRoutes from './routes/medicalHistoryRoutes.js';

//Models
import Tutor from './models/tutor.js';  // Importando o modelo Tutor
import Follow from './models/users/follow.js';
import Pet from './models/pet.js';  // Importando o modelo Pet
import MedicalHistory from './models/MedicalHistory.js';
import Vaccination from './models/Vaccination.js';
import Comment from './models/posts/comment.js';
import Post from './models/posts/post.js';
import { PostLike, CommentLike } from './models/posts/postLike.js';
import Share from './models/posts/share.js';

//middlewares
import verifyToken from './middlewares/verifyToken.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Definindo __filename e __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Definir a URL que tem acesso à API
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

async function syncDatabase() {
  try {
    // Verifica a conexão com o banco
    await sequelize.authenticate();
    console.log('Conexão com o Banco de Dados estabelecida com sucesso!');

    // Primeiro, sincronize os modelos independentes ou de base:
    await Tutor.sync({ force: false, logging: console.log });  // Tabela de tutores
    await Follow.sync({ force: false, logging: console.log });   // Tabela de follows, depende de Tutor

    // Depois, os modelos de posts, que dependem de Tutor:
    await Post.sync({ force: false, logging: console.log });
    await Share.sync({ force: false, logging: console.log });

    // Em seguida, os modelos relacionados a pets:
    await Pet.sync({ force: false, logging: console.log });
    await MedicalHistory.sync({ force: false, logging: console.log });
    await Vaccination.sync({ force: false, logging: console.log });

    // Por fim, as tabelas dependentes de outras (por exemplo, comentários e curtidas)
    await Comment.sync({ force: false, logging: console.log });
    await PostLike.sync({ force: false, logging: console.log });
    await CommentLike.sync({ force: false, logging: console.log });


    console.log('Tabelas criadas ou sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error.message);
    console.error(error);  // Exibe o erro completo
  }
}

async function startServer() {
  await syncDatabase();  // Aguarda a sincronização
  app.listen(3000, () => {
    console.log('Servidor aberto na porta 3000');
  });
}


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Auth
app.use('/auth', authRoutes);

// Tutor Location
app.use('/tutors', tutorLocation)

//Pass
app.use('/r', passRouter)

// Pet
app.use('', petRoutes);
app.use('', alertPets)

// Vaccination
app.use('', vaccinationRoutes);

// MedicalHistoryRoutes
app.use('', medicalHistoryRoutes);

// Posts
app.use('/api/posts', postsRoutes);

//Follow
app.use('/api/follow', verifyToken, followRouter)

startServer();