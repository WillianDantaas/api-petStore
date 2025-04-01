import express from 'express';
import postsController from '../../controllers/posts/postsController.js';
import commentsController from '../../controllers/posts/commentsController.js';
import likesController from '../../controllers/posts/likesController.js';
import sharesController from '../../controllers/posts/sharesController.js';

const router = express.Router();

// 📌 Rotas para Posts
router.post('/', postsController.createPost);         // Criar um post
router.get('/', postsController.getPosts);           // Listar posts
router.get('/:id', postsController.getPostById);     // Obter detalhes de um post
router.put('/:id', postsController.updatePost);      // Atualizar um post
router.delete('/:id', postsController.deletePost);   // Excluir um post

// 📌 Rotas para Comentários em Posts
router.post('/:postId/comments', commentsController.createComment);  // Criar um comentário
router.get('/:postId/comments', commentsController.getComments);     // Listar comentários de um post
router.put('/:postId/comments/:commentId', commentsController.updateComment);  // Atualizar um comentário
router.delete('/:postId/comments/:commentId', commentsController.deleteComment); // Excluir um comentário

// 📌 Rotas para Curtidas (Likes)
router.post('/:postId/likes', likesController.likePost);  // Curtir um post
router.post('/:postId/comments/:commentId/likes', likesController.likeComment);  // Curtir um comentário

// 📌 Rotas para Compartilhamento de Posts
router.post('/:postId/shares', sharesController.sharePost);  // Compartilhar um post

export default router;
