import Share from "../../models/posts/share.js";

const sharesController = {
  // Tutor compartilha um post
  async sharePost(req, res) {
    try {
      const { postId } = req.params;
      const { tutorId } = req.body;
      const share = await Share.create({ postId, tutorId });
      res.status(201).json(share);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default sharesController;
