import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';
import Pet from './pet.js';

const Vaccination = sequelize.define('Vaccination', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pet,
      key: 'id',
    },
  },
  vaccineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateAdministered: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  doses: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'vaccinations',
  timestamps: true,
});

Vaccination.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });
Pet.hasMany(Vaccination, { foreignKey: 'petId', as: 'vaccinations' });

export default Vaccination;
