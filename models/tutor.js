import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js'; // Importando a instância do sequelize
import bcrypt from 'bcryptjs';


const Tutor  = sequelize.define('Tutor', {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^\d{8}$/,
      },
      // is: /^\d{5}-\d{3}$/, // Validação para o formato brasileiro de CEP
    },
  },
  {
    sequelize,
    tableName: 'tutors',
    timestamps: true,
    hooks: {
      beforeCreate: async (tutor) => {
        if (tutor.password) {
          tutor.password = await bcrypt.hash(tutor.password, 10);
        }
      },
    },
  }
);

export default Tutor;
