import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const MedicalHistory = sequelize.define(
  "MedicalHistory",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    petId: { type: DataTypes.INTEGER, allowNull: false }, // Associação será definida depois
    date: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "medical_histories", timestamps: true }
);

export default MedicalHistory;
