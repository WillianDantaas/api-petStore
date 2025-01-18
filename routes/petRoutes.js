import express from 'express'
import verifyToken from '../middlewares/verifyToken.js';

// Table
import Tutor from '../models/tutor.js';
import Pet from '../models/pet.js';

const petRoutes = express.Router()

petRoutes.post('/pets', verifyToken, async (req, res) => {
  const { name, breed, age, microchip } = req.body;

  try {
    const tutorId = req.user.id

    const tutor = await Tutor.findByPk(tutorId);
    

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }

    const petCount = await Pet.count({ where: { tutorId } });

    if (petCount >= tutor.petLimit) {
      return res.status(400).json({ error: 'Limite de pets atingido' });
    }

    let rg;
    do {
      rg = Math.floor(10000000 + Math.random() * 90000000); // Gera número entre 10000000 e 99999999
    } while (await Pet.findOne({ where: { rg } })); // Garante unicidade no DB

    const newPet = await Pet.create({ name, breed, age, microchip, rg, tutorId });

    return res.status(201).json(newPet);
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

petRoutes.get('/pets', verifyToken, async (req, res) => {
  try {
    const tutorId = req.user.id

    const tutor = await Tutor.findByPk(tutorId);
    const pets = await Pet.findAll({ where: {tutorID: tutorId}})
    

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }



    return res.status(201).json(pets);
  } catch (error) {
    console.error('Erro ao consultar pets:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


  

// Alterar limites de pets por tutor individualmente
petRoutes.put('/tutors/:id/petLimit', async (req, res) => {
    const { id } = req.params;
    const { petLimit } = req.body;
  
    try {
      const tutor = await Tutor.findByPk(id);
  
      if (!tutor) {
        return res.status(404).json({ error: 'Tutor não encontrado' });
      }
  
      tutor.petLimit = petLimit;
      await tutor.save();
  
      return res.status(200).json(tutor);
    } catch (error) {
      console.error('Erro ao atualizar limite de pets:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  

export default petRoutes

