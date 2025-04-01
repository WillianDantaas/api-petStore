import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconfig.js';
import Tutor from '../tutor.js';
import Post from './post.js';

const Share = sequelize.define(
  'Share',
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
    tableName: 'shares',
    timestamps: true,
  }
);

Share.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
Share.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

export default Share;
