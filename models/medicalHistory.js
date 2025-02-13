import { DataTypes } from 'sequelize';
import sequelize from '../config/dbconfig.js';
import Pet from './pet.js';

const MedicalHistory = sequelize.define('MedicalHistory', {
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
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'medical_histories',
  timestamps: true,
});

MedicalHistory.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });
Pet.hasMany(MedicalHistory, { foreignKey: 'petId', as: 'medicalHistories' });

export default MedicalHistory;
