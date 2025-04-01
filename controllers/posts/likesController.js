
import { PostLike, CommentLike } from '../../models/posts/postLike.js'

const likesController = {
    // Tutor curte um post
    async likePost(req, res) {
        try {
            const { postId } = req.params;
            const { tutorId } = req.body;
            const like = await PostLike.create({ postId, tutorId });
            res.status(201).json(like);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Tutor curte um comentário
    async likeComment(req, res) {
        try {
            const { commentId } = req.params;
            const { tutorId } = req.body;
            const like = await CommentLike.create({ commentId, tutorId });
            res.status(201).json(like);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

export default likesController;
