import Post from '../../models/posts/post.js';
import Tutor from '../../models/tutor.js';

// Posts Controller
const postsController = {
  // Criar um novo post
  async createPost(req, res) {
    try {
        const { content, tutorId } = req.body;

        if (!content || !tutorId) {
            return res.status(400).json({ error: 'Conteúdo e tutorId são obrigatórios' });
        }

        // Verifica se há um arquivo de mídia no upload
        let media_url = null;
        let media_type = null;

        if (req.file) {
            const folder = req.file.mimetype.startsWith('image') ? 'images' : 'media';
            media_url = `/uploads/${folder}/${req.file.filename}`;
            media_type = req.file.mimetype.startsWith('image') ? 'image' : 'video';
        }

        const newPost = await Post.create({ content, media_url, media_type, tutorId });

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar post', details: error.message });
    }
},


  // Listar todos os posts
  async getPosts(req, res) {
    try {
      const posts = await Post.findAll({
        include: { model: Tutor, as: 'tutor', attributes: ['id', 'name', 'email'] },
        order: [['createdAt', 'DESC']], // Ordena do mais recente para o mais antigo
      });

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar posts', details: error.message });
    }
  },

  // Buscar um post específico pelo ID
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id, {
        include: { model: Tutor, as: 'tutor', attributes: ['id', 'name', 'email'] },
      });

      if (!post) return res.status(404).json({ error: 'Post não encontrado' });

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar post', details: error.message });
    }
  },

  // Atualizar um post existente
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const post = await Post.findByPk(id);
      if (!post) return res.status(404).json({ error: 'Post não encontrado' });

      // Atualiza o conteúdo se foi fornecido
      post.content = content || post.content;

      // Verifica se há um novo arquivo de mídia
      if (req.file) {
        post.media_url = `/uploads/${req.file.filename}`;
        post.media_type = req.file.mimetype.startsWith('image') ? 'image' : 'video';
      }

      await post.save();
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar post', details: error.message });
    }
  },

  // Deletar um post
  async deletePost(req, res) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);
      if (!post) return res.status(404).json({ error: 'Post não encontrado' });

      await post.destroy();
      res.status(200).json({ message: 'Post deletado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar post', details: error.message });
    }
  },
};

export default postsController;
