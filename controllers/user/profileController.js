import Tutor from '../../models/tutor.js';

export const getProfileById = async (req, res) => {
    const { id } = req.params;

    try {
        const tutor = await Tutor.findByPk(id, {
            attributes: [
                'id',
                'name',
                'email',
                'contact',
                'profilePicture',
                'city',
                'state',
                'is_premium',
                'premium_start_date',
                'premium_end_date',
                'createdAt'
            ]
        });

        if (!tutor) {
            return res.status(404).json({ message: 'Tutor não encontrado' });
        }

        return res.status(200).json(tutor);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar perfil' });
    }
};

export const getProfile = async (req, res) => {
    try {
      const tutorId = req.user?.id;
      
      if (!tutorId) {
        return res.status(400).json({ error: 'ID do tutor não encontrado no token' });
      }
  
      const tutor = await Tutor.findByPk(tutorId);
  
      if (!tutor) {
        return res.status(404).json({ error: 'Tutor não encontrado' });
      }

      const safeTutorData = {
        id: tutor.id,
        name: tutor.name,
        email: tutor.email,
        profilepicture: tutor.profilepicture,
        contact: tutor.contact,
        createdAt: tutor.createdAt,
        updatedAt: tutor.updatedAt
      };
  
      res.status(200).json(safeTutorData);
    } catch (error) {
      console.error('Erro ao obter perfil do tutor:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
  
  
