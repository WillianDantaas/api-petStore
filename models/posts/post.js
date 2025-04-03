import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconfig.js";
import Tutor from "../tutor.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tutor,
        key: "id",
      },
      onDelete: "CASCADE", // Exclui posts ao excluir o tutor
      onUpdate: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    media_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    tableName: "posts",
    timestamps: true,
  }
);

Post.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });

export default Post;
