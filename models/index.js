import Tutor from "./tutor.js";
import Pet from "./pet.js";
import MedicalHistory from "./MedicalHistory.js";
import Vaccination from "./Vaccination.js";
import Post from "./posts/post.js";
import Comment from "./posts/comment.js";
import { PostLike, CommentLike } from "./posts/postLike.js";
import Share from "./posts/share.js";
import Follow from "./users/follow.js";

// Agrupar os models em um objeto
const models = {
  Tutor,
  Pet,
  MedicalHistory,
  Vaccination,
  Post,
  Comment,
  PostLike,
  CommentLike,
  Share,
  Follow
};

// Tutor - Pet
Tutor.hasMany(Pet, { foreignKey: "tutorId", as: "pets", onDelete: "CASCADE", onUpdate: "CASCADE" });
Pet.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });

// Pet - MedicalHistory & Vaccination
Pet.hasMany(MedicalHistory, { foreignKey: "petId", as: "medicalHistories", onDelete: "CASCADE", onUpdate: "CASCADE" });
MedicalHistory.belongsTo(Pet, { foreignKey: "petId", as: "pet" });

Pet.hasMany(Vaccination, { foreignKey: "petId", as: "vaccinations", onDelete: "CASCADE", onUpdate: "CASCADE" });
Vaccination.belongsTo(Pet, { foreignKey: "petId", as: "pet" });

// Tutor - Post
Tutor.hasMany(Post, { foreignKey: "tutorId", as: "posts", onDelete: "CASCADE", onUpdate: "CASCADE" });
Post.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });

// Tutor - Comment
Tutor.hasMany(Comment, { foreignKey: "tutorId", as: "comments", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });

// Post - Comment
Post.hasMany(Comment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Tutor - PostLike
Tutor.hasMany(PostLike, { foreignKey: "tutorId", as: "postLikes", onDelete: "CASCADE", onUpdate: "CASCADE" });
PostLike.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });

// Post - PostLike
Post.hasMany(PostLike, { foreignKey: "postId", as: "postLikes", onDelete: "CASCADE", onUpdate: "CASCADE" });
PostLike.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Tutor - CommentLike
Tutor.hasMany(CommentLike, { foreignKey: "tutorId", as: "commentLikes", onDelete: "CASCADE", onUpdate: "CASCADE" });
CommentLike.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });

// Comment - CommentLike
Comment.hasMany(CommentLike, { foreignKey: "commentId", as: "commentLikes", onDelete: "CASCADE", onUpdate: "CASCADE" });
CommentLike.belongsTo(Comment, { foreignKey: "commentId", as: "comment" });

// Tutor - Share
Tutor.hasMany(Share, { foreignKey: "tutorId", as: "shares", onDelete: "CASCADE", onUpdate: "CASCADE" });
Share.belongsTo(Tutor, { foreignKey: "tutorId", as: "tutor" });

// Post - Share
Post.hasMany(Share, { foreignKey: "postId", as: "shares", onDelete: "CASCADE", onUpdate: "CASCADE" });
Share.belongsTo(Post, { foreignKey: "postId", as: "post" });

// Tutor - Follow (seguidores e seguindo)
Tutor.belongsToMany(Tutor, {
  through: Follow,
  as: 'seguindo',
  foreignKey: 'followerId',
  otherKey: 'followingId',
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Tutor.belongsToMany(Tutor, {
  through: Follow,
  as: 'seguidores',
  foreignKey: 'followingId',
  otherKey: 'followerId',
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// 🔁 Executar o associate se existir
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export default models;
