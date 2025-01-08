import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';  // Importando a instância do sequelize

const Tutor = sequelize.define('Tutor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { // Nome completo
    type: DataTypes.STRING,
    allowNull: false,
  },
  document: { // CPF
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: { // Email
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: { // Telefone
    type: DataTypes.STRING,
    allowNull: false,
  },
  refresh_token: { // Refresh token
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {  // Novo campo
    type: DataTypes.STRING,
    allowNull: false,  // Garante que a senha seja obrigatória
  },
}, {
  tableName: 'tutors',
  timestamps: true, // Cria automaticamente `createdAt` e `updatedAt`
  hooks: {
    beforeCreate: async (tutor) => {
      // Criptografando a senha antes de salvar
      if (tutor.password) {
        tutor.password = await bcrypt.hash(tutor.password, 10); // 10 é o número de "salt rounds"
      }
    },
  },
});

export default Tutor;
