import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js'; // Instância do Sequelize
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
          if (value == null) return;
          if (!/^\d{11}$/.test(value)) {
            throw new Error('O documento deve conter exatamente 11 dígitos numéricos');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
      set(value) {
        if (value) {
          this.setDataValue('email', value.toLowerCase());
        }
      },
    },
    profilepicture: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value == null) return;
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
          if (!/^.{8,}$/.test(value)) {
            throw new Error('A senha deve conter no mínimo 8 dígitos');
          }
        },
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    confirmationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
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
        is: /^[A-Za-z]{2}$/,
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
        is: /^\d{8}$/,
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
    resetPasswordFailedAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    resetPasswordLockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    premium_plan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    premium_start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    premium_end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "tutors",
    timestamps: true,
    hooks: {
      beforeCreate: async (tutor) => {
        if (tutor.password) {
          tutor.password = await encryption.hashPassword(tutor.password);
        }
      },
      beforeUpdate: async (tutor) => {
        if (tutor.password && tutor.changed("password")) {
          tutor.password = await encryption.hashPassword(tutor.password);
        }
      },
    },
  }
);

// Reset de tentativas de redefinição de senha
Tutor.addHook("beforeSave", async (tutor) => {
  if (tutor.resetPasswordFailedAttempts >= 3) {
    if (!tutor.resetPasswordLockedUntil || tutor.resetPasswordLockedUntil <= new Date()) {
      tutor.resetPasswordFailedAttempts = 0;
      tutor.resetPasswordLockedUntil = null;
    }
  }
});

Tutor.prototype.isResetPasswordLocked = function () {
  if (this.resetPasswordFailedAttempts >= 3) {
    if (this.resetPasswordLockedUntil && this.resetPasswordLockedUntil > new Date()) {
      return true;
    }
  }
  return false;
};

Tutor.associate = (models) => {
  Tutor.belongsToMany(models.Tutor, {
    through: models.Follow,
    as: 'seguindo',
    foreignKey: 'followerId',
    otherKey: 'followingId',
  });

  Tutor.belongsToMany(models.Tutor, {
    through: models.Follow,
    as: 'seguidores',
    foreignKey: 'followingId',
    otherKey: 'followerId',
  });
};


export default Tutor;
