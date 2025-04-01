import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconfig.js';
import Tutor from '../tutor.js';
import Post from './post.js';

const Comment = sequelize.define(
  'Comment',
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
    // Se for uma resposta, armazena o id do comentário pai
    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tutor,
        key: 'id',
      },
    },
  },
  {
    tableName: 'comments',
    timestamps: true,
  }
);

Comment.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
Tutor.hasMany(Comment, { foreignKey: 'tutorId', as: 'comments' });

Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });

export default Comment;
