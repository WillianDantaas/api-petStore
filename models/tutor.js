import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js'; // Importando a instância do sequelize
import bcrypt from 'bcryptjs';


const Tutor = sequelize.define('Tutor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      set(value) {
        this.setDataValue('name', value.toLowerCase())
      },
    }
  },
  document: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      validateIsdocument(value) {
        if (!/^\d{11}$/.test(value)) {
          throw new Error('O documento deve conter exatamente 11 dígitos numéricos');
        }
      }

    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      set(value) {
        this.setDataValue('email', value.toLowerCase())
      },
    }
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      set(value) {

        if(!/^(\d{11})$/.test(value)) {
          throw new Error('Número de celular deve conter exatamente 11 dígitos numéricos contando o DDD')
        }


        this.setDataValue('contact', value.startsWith('+55') ? value : value.replace(/^(\d{9})$/, '+55$1'))
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      set(value) {
        if(!/^.{9,}$/.test(value)) {
          throw new Error('A senha deve conter no mínimo 9 dígitos')
        }
      }
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      set(value) {
        this.setDataValue('address', value.toLowerCase())
      },
    }
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  complement: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      set(value) {
        this.setDataValue('complement', value.toLowerCase())
      },
      isValidComplement(value) {

        if (value && value.length < 3) {
          throw new Error('O complemento deve ter pelo menos 3 caracteres');
        }
      }
    }
  },
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      set(value) {
        this.setDataValue('neighborhood', value.toLowerCase())
      },
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      set(value) {
        this.setDataValue('city', value.toLowerCase())
      },
    }
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[A-Za-z]{2}$/, // Aceita minúsculas e maiúsculas
    },
    set(value) {
      this.setDataValue('state', value.toUpperCase())
    },
  },
  cep: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^\d{8}$/,
    },
    // is: /^\d{5}-\d{3}$/, // Validação para o formato brasileiro de CEP
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
          tutor.password = await bcrypt.hash(tutor.password, 10);
        }
      },
      beforeUpdate: async (tutor) => {
        if (tutor.password && tutor.changed('password')) {
          tutor.password = await bcrypt.hash(tutor.password, 10);
        }
      },
      
    },
  }
);

export default Tutor;
