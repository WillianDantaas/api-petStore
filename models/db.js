import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('petStorage', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})
sequelize.authenticate().then(() => {
    console.log(`Conectado ao Banco de Dados`)
}).catch((erro) => {
    console.log(`Falha ao se conectar com Banco de Dados: ` + erro)
})


export default sequelize