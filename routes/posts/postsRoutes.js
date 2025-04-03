import express from 'express';
import postsController from '../../controllers/posts/postsController.js';
import commentsController from '../../controllers/posts/commentsController.js';
import likesController from '../../controllers/posts/likesController.js';
import sharesController from '../../controllers/posts/sharesController.js';
import verifyToken from '../../middlewares/verifyToken.js';
import upload from '../../middlewares/uploadMiddleware.js';

const router = express.Router();

// 📌 Rotas para Posts
router.post('/', verifyToken, upload.single('media'), postsController.createPost);         // Criar um post
router.get('/', verifyToken, postsController.getPosts);           // Listar posts
router.get('/:id', verifyToken, postsController.getPostById);     // Obter detalhes de um post
router.put('/:id', verifyToken, postsController.updatePost);      // Atualizar um post
router.delete('/:id', verifyToken, postsController.deletePost);   // Excluir um post

// 📌 Rotas para Comentários em Posts
router.post('/:postId/comments', verifyToken, commentsController.createComment);  // Criar um comentário
router.get('/:postId/comments', verifyToken, commentsController.getComments);     // Listar comentários de um post
router.put('/:postId/comments/:commentId', verifyToken, commentsController.updateComment);  // Atualizar um comentário
router.delete('/:postId/comments/:commentId', verifyToken, commentsController.deleteComment); // Excluir um comentário

// 📌 Rotas para Curtidas (Likes)
router.post('/:postId/likes', verifyToken, likesController.likePost);  // Curtir um post
router.post('/:postId/comments/:commentId/likes', verifyToken, likesController.likeComment);  // Curtir um comentário

// 📌 Rotas para Compartilhamento de Posts
router.post('/:postId/shares', verifyToken, sharesController.sharePost);  // Compartilhar um post

export default router;
