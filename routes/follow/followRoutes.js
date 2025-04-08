import express from 'express';
import { 
  checkFollow, 
  followTutor, 
  unfollowTutor, 
  removeFollower, 
  countFollows, 
  listFollows 
} from '../../controllers/follow/followController.js';

const followRouter = express.Router();

// Rota para verificar se já segue (ex: GET /api/follow/check/2)
followRouter.get('/check/:tutorId', checkFollow);

// Rota para seguir um tutor (ex: POST /api/follow/2)
followRouter.post('/:tutorId', followTutor);

// Rota para parar de seguir um tutor (ex: DELETE /api/follow/2)
followRouter.delete('/:tutorId', unfollowTutor);

// Rota para remover um seguidor (ex: DELETE /api/follow/remove/3)
followRouter.delete('/remove/:followerId', removeFollower);

// Rota para contar seguidores e seguindo (ex: GET /api/follow/count/2)
followRouter.get('/count/:tutorId', countFollows);

// Rota para listar seguidores ou seguindo (ex: GET /api/follow/list/2?type=seguidores ou seguindo)
followRouter.get('/list/:tutorId', listFollows);

export default followRouter;
