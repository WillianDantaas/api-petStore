// routes/follow/followController.js
import Follow from '../../models/users/follow.js'
import Tutor from '../../models/tutor.js';
import { Op } from 'sequelize';

/**
 * Verifica se o tutor logado já segue o tutor cujo ID está em req.params.tutorId.
 */
export const checkFollow = async (req, res) => {
  try {
    // O tutor logado vem de req.user (middleware de autenticação)
    const loggedTutorId = req.user.id;
    const tutorIdToCheck = req.params.tutorId;

    const follow = await Follow.findOne({
      where: {
        followerId: loggedTutorId,
        followingId: tutorIdToCheck,
      },
    });

    return res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Erro no checkFollow:', error.message);
    return res.status(500).json({ error: 'Erro ao verificar o seguimento' });
  }
};

/**
 * Inicia o seguimento: o tutor logado (follower) passa a seguir o tutor em req.params.tutorId.
 */
export const followTutor = async (req, res) => {
  try {
    const loggedTutorId = req.user.id;
    const tutorIdToFollow = req.params.tutorId;

    // Verifica se já existe um registro de follow
    const existingFollow = await Follow.findOne({
      where: {
        followerId: loggedTutorId,
        followingId: tutorIdToFollow,
      },
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Você já está seguindo este tutor.' });
    }

    const newFollow = await Follow.create({
      followerId: loggedTutorId,
      followingId: tutorIdToFollow,
    });

    return res.status(201).json(newFollow);
  } catch (error) {
    console.error('Erro em followTutor:', error.message);
    return res.status(500).json({ error: 'Erro ao seguir o tutor' });
  }
};

/**
 * Para de seguir: o tutor logado deixa de seguir o tutor cujo ID está em req.params.tutorId.
 */
export const unfollowTutor = async (req, res) => {
  try {
    const loggedTutorId = req.user.id;
    const tutorIdToUnfollow = req.params.tutorId;

    const deleted = await Follow.destroy({
      where: {
        followerId: loggedTutorId,
        followingId: tutorIdToUnfollow,
      },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Registro de seguimento não encontrado.' });
    }

    return res.status(200).json({ message: 'Parou de seguir com sucesso.' });
  } catch (error) {
    console.error('Erro em unfollowTutor:', error.message);
    return res.status(500).json({ error: 'Erro ao deixar de seguir o tutor' });
  }
};

/**
 * Remove um seguidor: o tutor logado remove da sua lista de seguidores o tutor cujo ID está em req.params.followerId.
 * Apenas o tutor que é seguido pode remover um seguidor.
 */
export const removeFollower = async (req, res) => {
  try {
    const loggedTutorId = req.user.id;
    const followerIdToRemove = req.params.followerId;

    // Verifica se existe registro: onde o tutor logado é seguido (followingId) e o seguidor é followerIdToRemove
    const deleted = await Follow.destroy({
      where: {
        followerId: followerIdToRemove,
        followingId: loggedTutorId,
      },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Registro de seguidor não encontrado.' });
    }

    return res.status(200).json({ message: 'Seguidor removido com sucesso.' });
  } catch (error) {
    console.error('Erro em removeFollower:', error.message);
    return res.status(500).json({ error: 'Erro ao remover seguidor' });
  }
};

/**
 * Retorna a contagem de seguidores e de quem o tutor segue.
 * Se req.params.tutorId for fornecido, retorna os dados para aquele tutor;
 * caso contrário, utiliza o tutor logado.
 */
export const countFollows = async (req, res) => {
  try {
    const tutorId = req.params.tutorId || req.user.id;

    const seguidoresCount = await Follow.count({
      where: {
        followingId: tutorId,
      },
    });

    const seguindoCount = await Follow.count({
      where: {
        followerId: tutorId,
      },
    });

    return res.status(200).json({
      seguidores: seguidoresCount,
      seguindo: seguindoCount,
    });
  } catch (error) {
    console.error('Erro em countFollows:', error.message);
    return res.status(500).json({ error: 'Erro ao contar seguidores/following' });
  }
};

/**
 * Lista seguidores ou seguindo.
 * Use a query parameter `type`:
 *   - type=seguidores: retorna os tutores que seguem o tutor (where followingId = tutorId)
 *   - type=seguindo: retorna os tutores que o tutor segue (where followerId = tutorId)
 */
export const listFollows = async (req, res) => {
  try {
    const tutorId = req.params.tutorId || req.user.id;
    const type = req.query.type; // Espera 'seguidores' ou 'seguindo'

    let follows;
    if (type === 'seguidores') {
      follows = await Follow.findAll({
        where: { followingId: tutorId },
        include: [{
          model: Tutor,
          as: 'seguidor',
          attributes: ['id', 'name', 'email']
        }]
      });
    } else if (type === 'seguindo') {
      follows = await Follow.findAll({
        where: { followerId: tutorId },
        include: [{
          model: Tutor,
          as: 'seguido',
          attributes: ['id', 'name', 'email']
        }]
      });
    } else {
      return res.status(400).json({ error: "Query parameter 'type' inválido. Use 'seguidores' ou 'seguindo'." });
    }

    return res.status(200).json(follows);
  } catch (error) {
    console.error('Erro em listFollows:', error.message);
    return res.status(500).json({ error: 'Erro ao listar seguidores/following' });
  }
};
