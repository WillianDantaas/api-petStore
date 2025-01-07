
const express = require('express');
const cors = require('cors');
// const cookieParser = require('cookie-parser');



const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*") //Definir a URL que tem acesso a API
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE')
    res.header("Access-Control-Allow-Headers", "*")
    app.use(cors());
    app.use(cookieParser())
    next();
})

// app.use(cors())

app.listen(8080, () => {
    console.log('Servidor aberto na porta 8080')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas
