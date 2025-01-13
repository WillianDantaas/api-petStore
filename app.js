import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
import sequelize from './config/dbconfig.js';  // Conexão do Sequelize

import authRoutes from './routes/authRoutes.js';
import passRouter from './routes/passRouter.js';
import petRoutes from './routes/petRoutes.js';

import Tutor from './models/tutor.js';  // Importando o modelo Tutor
import Pet from './models/pet.js';  // Importando o modelo Pet

dotenv.config();

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

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

    // Sincroniza os modelos separadamente
    await Tutor.sync({ force: false, logging: console.log });
    // console.log('Tabela de Tutor criada com sucesso!');

    await Pet.sync({ force: false, logging: console.log });
    // console.log('Tabela de Pet criada com sucesso!');
    
    console.log('Tabelas criadas ou sincronizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error.message);
    console.error(error);  // Exibe o erro completo
  }
}

async function startServer() {
  await syncDatabase();  // Aguarda a sincronização
  app.listen(8080, () => {
    console.log('Servidor aberto na porta 8080');
  });
}

startServer();  // Inicia o servidor após sincronizar o banco de dados

app.use('/a', authRoutes);
app.use('/r', passRouter)
app.use('/p', petRoutes);
