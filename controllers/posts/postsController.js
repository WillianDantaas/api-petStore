import Post from '../../models/posts/post.js';
import Tutor from '../../models/tutor.js';

// Posts Controller
const postsController = {
  // Criar um novo post
  async createPost(req, res) {
    try {
      const { content } = req.body;
      const tutorId = req.user.id; // Pegando do token via middleware verifyToken

      if (!content) {
        return res.status(400).json({ error: "O conteúdo é obrigatório." });
      }

      if (!req.file) {
        return res.status(400).json({ error: "A mídia (imagem ou vídeo) é obrigatória." });
      }

      console.log("📌 Arquivo recebido:", req.file); // Verifica se o multer está funcionando
      console.log("📌 Conteúdo recebido:", req.body);

      // Define caminho e tipo da mídia
      const folder = req.file.mimetype.startsWith("image") ? "images" : "media";
      const media_url = `/uploads/${folder}/${req.file.filename}`;
      const media_type = req.file.mimetype.startsWith("image") ? "image" : "video";

      console.log("📌 Salvando post com:", { content, media_url, media_type, tutorId });

      // Criando o post no banco de dados
      const newPost = await Post.create({
        content,
        media_url,
        media_type,
        tutorId
      });

      return res.status(201).json(newPost);
    } catch (error) {
      console.error("❌ Erro ao criar post:", error);
      return res.status(500).json({ error: "Erro ao criar post", details: error.message });
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

      // Atualiza o conteúdo, se fornecido
      post.content = content || post.content;

      // Se houver novo arquivo de mídia, atualiza a mídia usando a mesma lógica do create
      if (req.file) {
        const folder = req.file.mimetype.startsWith('image') ? 'images' : 'media';
        post.media_url = `/uploads/${folder}/${req.file.filename}`;
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
