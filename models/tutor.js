import { DataTypes } from 'sequelize';
import sequelize from './db.js'; // Caminho para o arquivo onde configurou o Sequelize


const Tutor = sequelize.define('Tutor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  document: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'tutors',
  timestamps: true, // Cria automaticamente `createdAt` e `updatedAt`
});

export default Tutor;