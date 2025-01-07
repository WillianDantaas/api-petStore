import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';  // Importando a instância do sequelize

import Tutor from './tutor.js'; // Importar o modelo Tutor para relacionar

// Definindo o modelo Pet
const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { // Nome
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: { // Idade
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rg: { // GERADO AUTOMATICAMENTE
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  microchip: { // NUMERAÇÃO DO MICROSHIP SE TIVER
    type: DataTypes.STRING,
    allowNull: true,
  },
  photo: { // F
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

// Definindo o relacionamento entre Pet e Tutor
Pet.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
Tutor.hasMany(Pet, { foreignKey: 'tutorId', as: 'pets' });

export default Pet;
