import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';  // Conexão do Sequelize
import Tutor from './tutor.js'; // Importando o modelo Tutor

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rg: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  microchip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tutorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tutor, // Relacionamento com o modelo Tutor
      key: 'id',
    },
  },
}, {
  tableName: 'pets',
  timestamps: true,
});

// Relacionamento entre Pet e Tutor
Pet.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
Tutor.hasMany(Pet, { foreignKey: 'tutorId', as: 'pets' });

export default Pet;
