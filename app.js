import express, { Router, json, urlencoded } from 'express';
import cors from 'cors';
import sequelize from './config/dbconfig.js';

import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';

const app = express();

app.use(json())
app.use(urlencoded({ extended: true }))

sequelize.sync({ force: false, alter: false}) // `force: false` vai garantir que não exclua as tabelas existentes
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") //Definir a URL que tem acesso a API
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE')
    res.header("Access-Control-Allow-Headers", "*")
    app.use(cors());
    // app.use(cookieParser())
    next();
})

app.use('/a', authRoutes)
app.use('/p', petRoutes)


app.listen(8080, () => {
    console.log('Servidor aberto na porta 8080')
})



