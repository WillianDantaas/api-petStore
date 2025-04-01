import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconfig.js';
import Tutor from '../tutor.js';
import Post from './post.js';
import Comment from './comment.js';

// Curtidas para publicações
const PostLike = sequelize.define(
  'PostLike',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    tableName: 'post_likes',
    timestamps: true,
  }
);

PostLike.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
PostLike.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Curtidas para comentários
const CommentLike = sequelize.define(
  'CommentLike',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment,
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
    tableName: 'comment_likes',
    timestamps: true,
  }
);

CommentLike.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
CommentLike.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' });

export { PostLike, CommentLike };
