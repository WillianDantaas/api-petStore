import Comment from '../../models/posts/comment.js';

const commentsController = {
  // Cria um novo comentário ou resposta
  async createComment(req, res) {
    try {
      const { content, parentCommentId, postId, tutorId } = req.body;
      const newComment = await Comment.create({ content, parentCommentId, postId, tutorId });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lista os comentários de um post específico
  async getComments(req, res) {
    try {
      const { postId } = req.query; // ou via req.params, conforme a rota
      const comments = await Comment.findAll({ where: { postId } });
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Atualiza um comentário
  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const comment = await Comment.findByPk(commentId);
      if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });

      comment.content = content || comment.content;
      await comment.save();
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Deleta um comentário
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findByPk(commentId);
      if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });

      await comment.destroy();
      res.status(200).json({ message: 'Comentário removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default commentsController;
