import express from 'express'
import verifyToken from '../middlewares/verifyToken.js';

// Table
import Tutor from '../models/tutor.js';
import Pet from '../models/pet.js';

const petRoutes = express.Router()

// Registrar novo Pet
petRoutes.post('/pets', verifyToken, async (req, res) => {
  // Extraindo os campos do corpo da requisição
  const {
    name,
    species,
    breed,
    age,
    sex,
    weight,
    color,
    distinctiveMarks,
    microchip,
    image,
    behavior,
    observations
  } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !species || !breed || age === undefined || age === null || !sex) {
    return res.status(400).json({
      error: "Os campos 'name', 'species', 'breed', 'age' e 'sex' são obrigatórios."
    });
  }
  
  // Validação para garantir que a idade seja um número
  if (isNaN(Number(age))) {
    return res.status(400).json({
      error: "O campo 'age' deve ser um número."
    });
  }

  try {
    const tutorId = req.user.id;
    const tutor = await Tutor.findByPk(tutorId);

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }

    // Verifica se o tutor atingiu o limite de pets
    const petCount = await Pet.count({ where: { tutorId } });
    if (petCount >= tutor.petLimit) {
      return res.status(400).json({ error: 'Limite de pets atingido' });
    }

    // Geração de um número único para RG
    let rg;
    do {
      rg = Math.floor(100000000 + Math.random() * 900000000);
    } while (await Pet.findOne({ where: { rg } }));

    // Criação do novo pet com todos os campos
    const newPet = await Pet.create({
      name,
      species,
      breed,
      age,
      sex,
      weight,
      color,
      distinctiveMarks,
      microchip,
      image,
      behavior,
      observations,
      rg,
      tutorId,
    });

    return res.status(201).json(newPet);
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

//consultar pets do tutor
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

