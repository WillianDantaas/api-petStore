import { DataTypes } from "sequelize";
import sequelize from "../../config/dbconfig.js";
import Tutor from "../tutor.js";
import Post from "./post.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tutor,
        key: "id",
      },
      onDelete: "CASCADE", // Exclui comentários ao excluir o tutor
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  }
);

Comment.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

export default Comment;
