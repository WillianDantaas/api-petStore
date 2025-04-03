import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";
import Tutor from "./tutor.js";

const Pet = sequelize.define(
  "Pet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    species: { type: DataTypes.STRING, allowNull: false },
    breed: { type: DataTypes.STRING, allowNull: false },
    birth_date: { type: DataTypes.DATE, allowNull: false },
    sex: { type: DataTypes.STRING, allowNull: false },
    weight: { type: DataTypes.FLOAT, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },
    distinctiveMarks: { type: DataTypes.STRING, allowNull: true },
    rg: { type: DataTypes.STRING, allowNull: false, unique: true },
    microchip: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    behavior: { type: DataTypes.TEXT, allowNull: true },
    observations: { type: DataTypes.TEXT, allowNull: true },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Tutor, key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    isDeceased: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deathDate: { type: DataTypes.DATE, allowNull: true },
    lost_alert_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    lost_alert_triggered_at: { type: DataTypes.DATE, allowNull: true },
    alert_latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    alert_longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    lost_alert_disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: "pets", timestamps: true }
);

export default Pet;