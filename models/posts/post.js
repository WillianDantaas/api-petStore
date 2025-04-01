import { DataTypes } from 'sequelize';
import sequelize from '../../config/dbconfig.js';
import Tutor from '../tutor.js';

const Post = sequelize.define(
  'Post',
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
    media_url: {
      type: DataTypes.STRING,
      allowNull: true, // Imagens/Vídeos são opcionais
    },
    media_type: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: true, // Tipo da mídia (se existir)
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
    tableName: 'posts',
    timestamps: true, // Captura 'createdAt' e 'updatedAt'
  }
);

// Relacionamento: Um tutor pode ter vários posts
Post.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });
Tutor.hasMany(Post, { foreignKey: 'tutorId', as: 'posts' });

export default Post;