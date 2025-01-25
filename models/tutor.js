import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js'; // Importando a instância do sequelize
import encryption from '../utils/encryption.js';

const Tutor = sequelize.define(
  'Tutor',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        if (value) {
          this.setDataValue('name', value.toLowerCase());
        }
      },
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        validateIsdocument(value) {
          if (value == null) {
            return; // Permite null ou undefined
          }

          if (!/^\d{11}$/.test(value)) {
            throw new Error('O documento deve conter exatamente 11 dígitos numéricos');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Valida formato de e-mail
      },
      set(value) {
        if (value) {
          this.setDataValue('email', value.toLowerCase());
        }
      },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value == null) {
          return; // Permite null ou undefined
        }

        if (!/^(\d{11})$/.test(value)) {
          throw new Error('Número de celular deve conter exatamente 11 dígitos numéricos contando o DDD');
        }

        this.setDataValue('contact', value.startsWith('+55') ? value : `+55${value}`);
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isMinLength(value) {
          if (!/^.{9,}$/.test(value)) {
            throw new Error('A senha deve conter no mínimo 9 dígitos');
          }
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) {
          this.setDataValue('address', value.toLowerCase());
        }
      },
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) {
          this.setDataValue('complement', value.toLowerCase());
        }
      },
      validate: {
        isValidComplement(value) {
          if (value && value.length < 3) {
            throw new Error('O complemento deve ter pelo menos 3 caracteres');
          }
        },
      },
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) {
          this.setDataValue('neighborhood', value.toLowerCase());
        }
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) {
          this.setDataValue('city', value.toLowerCase());
        }
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[A-Za-z]{2}$/, // Aceita minúsculas e maiúsculas
      },
      set(value) {
        if (value) {
          this.setDataValue('state', value.toUpperCase());
        }
      },
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^\d{8}$/, // Aceita apenas 8 dígitos
      },
    },
    petLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tutors',
    timestamps: true,
    hooks: {
      beforeCreate: async (tutor) => {
        if (tutor.password) {
          tutor.password = await encryption.hashPassword(tutor.password);
        }
      },
      beforeUpdate: async (tutor) => {
        if (tutor.password && tutor.changed('password')) {
          tutor.password = await encryption.hashPassword(tutor.password);
        }
      },
    },
  }
);

export default Tutor;
