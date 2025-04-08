import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconfig.js";

    const Follow = sequelize.define('Follow', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      followerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      followingId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    }, {
      tableName: 'follows',
      timestamps: true
    });
  
    Follow.associate = (models) => {
      Follow.belongsTo(models.Tutor, {
        foreignKey: 'followerId',
        as: 'seguidor'
      });
  
      Follow.belongsTo(models.Tutor, {
        foreignKey: 'followingId',
        as: 'seguido'
      });
    };

export default Follow


  