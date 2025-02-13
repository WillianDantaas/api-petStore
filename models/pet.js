// Pet.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';
import Tutor from './tutor.js';

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
  species: {
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
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  distinctiveMarks: {
    type: DataTypes.STRING,
    allowNull: true,
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
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  behavior: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tutorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tutor,
      key: 'id',
    },
  },
}, {
  tableName: 'pets',
  timestamps: true,
});

Pet.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
Tutor.hasMany(Pet, { foreignKey: 'tutorId', as: 'pets' });

export default Pet;
