import express from 'express'
import path from 'path';

// middlewares
import verifyToken from '../middlewares/verifyToken.js';
import upload from '../middlewares/multer.js';

// Table
import Tutor from '../models/tutor.js';
import Pet from '../models/pet.js';

const petRoutes = express.Router()

// Registrar novo Pet
petRoutes.post('/pets', verifyToken, upload.single('image'), async (req, res) => {
  const {
    name,
    species,
    breed,
    birth_date,
    sex,
    weight,
    color,
    distinctiveMarks,
    microchip,
    behavior,
    observations
  } = req.body;

  // Validação dos campos obrigatórios
  if (!name) {
    return res.status(400).json({ error: "O campo 'name' é obrigatório." });
  }
  
  if (!species) {
    return res.status(400).json({ error: "O campo 'species' é obrigatório." });
  }
  
  if (!breed) {
    return res.status(400).json({ error: "O campo 'breed' é obrigatório." });
  }
  
  if (birth_date === undefined || birth_date === null) {
    return res.status(400).json({ error: "O campo 'birth_date' é obrigatório." });
  }
  
  if (!sex) {
    return res.status(400).json({ error: "O campo 'sex' é obrigatório." });
  }
  
  if (isNaN(new Date(birth_date).getTime())) {
    return res.status(400).json({
      error: "Data de nascimento deve ser uma Data válida."
    });
  }

  try {
    const tutorId = req.user.id;
    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }

    const petCount = await Pet.count({ where: { tutorId } });
    if (petCount >= tutor.petLimit) {
      return res.status(400).json({ error: 'Limite de pets atingido' });
    }

    // Se o campo "rg" for usado, gere-o; caso contrário, ignore essa parte
    let rg;
    do {
      rg = Math.floor(100000000 + Math.random() * 900000000).toString();
    } while (await Pet.findOne({ where: { rg } }));

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path;
    }

    const newPet = await Pet.create({
      name,
      species,
      breed,
      birth_date: new Date(birth_date).getTime(),
      sex,
      weight: weight ? Number(weight) : null,
      color: color || null,
      distinctiveMarks: distinctiveMarks || null,
      microchip: microchip || null,
      image: imagePath,
      behavior: behavior || null,
      observations: observations || null,
      rg,
      tutorId,
    });

    return res.status(201).json(newPet);
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


/**
 * GET /pets
 * Retorna todos os pets do tutor autenticado, incluindo o campo "image" (caminho para a imagem).
 */
petRoutes.get('/pets', verifyToken, async (req, res) => {
  try {
    const tutorId = req.user.id;
    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor não encontrado' });
    }
    // Busca os pets do tutor
    const pets = await Pet.findAll({ where: { tutorId } });
    // Atualiza cada pet: se o campo image existir, extraia o nome do arquivo
    const updatedPets = pets.map((pet) => {
      const petObj = pet.toJSON ? pet.toJSON() : pet;
      if (petObj.image) {
        // Extrai somente o nome do arquivo utilizando path.basename
        const filename = path.basename(petObj.image);
        // Constrói a URL completa para o arquivo, apontando para a rota estática /uploads
        petObj.image = `${process.env.API_URL}/uploads/${filename}`;
      }
      return petObj;
    });

    return res.status(200).json(updatedPets);
  } catch (error) {
    console.error('Erro ao consultar pets:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * PUT /pets/:id
 * Atualiza os dados de um pet, inclusive sua imagem.
 * Usa o middleware de upload para processar o arquivo enviado no campo "image".
 */
petRoutes.put('/pets/:id', verifyToken, upload.single('image'), async (req, res) => {
  const petId = req.params.id;
  // Extraindo os dados do corpo (a imagem vem em req.file, se enviada)
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
    behavior,
    observations,
  } = req.body;
  
  try {
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    // Atualiza os campos se fornecidos
    pet.name = name || pet.name;
    pet.species = species || pet.species;
    pet.breed = breed || pet.breed;
    pet.age = age ? Number(age) : pet.age;
    pet.sex = sex || pet.sex;
    pet.weight = weight ? Number(weight) : pet.weight;
    pet.color = color || pet.color;
    pet.distinctiveMarks = distinctiveMarks || pet.distinctiveMarks;
    pet.microchip = microchip || pet.microchip;
    pet.behavior = behavior || pet.behavior;
    pet.observations = observations || pet.observations;
    
    // Se um novo arquivo foi enviado, atualize o campo image
    if (req.file) {
      pet.image = req.file.path;
    }
    
    await pet.save();
    return res.status(200).json(pet);
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
  

/**
 * DELETE /pets/:id
 * Exclui o cadastro do Pet
 */
petRoutes.delete('/pets/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const pet = await Pet.findByPk(id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }
    await pet.destroy();
    return res.status(200).json({ message: 'Pet excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pet:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

/**
 * PATCH /pets/:id/death
 * Informa o falecimento do Pet
 */
petRoutes.patch('/pets/:id/death', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { deathDate } = req.body;
  
  if (!deathDate) {
    return res.status(400).json({ error: 'Informe a data de falecimento do pet.' });
  }
  

  try {
    const pet = await Pet.findByPk(id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }

    if (pet.isDeceased) {
      return res.status(409).json({error: 'Pet informado já falecido.'})
    }

    pet.isDeceased = true;
    pet.deathDate = deathDate; // data informada pelo tutor
    await pet.save();
    return res.status(200).json({ message: 'Falecimento do pet informado com sucesso', pet });
  } catch (error) {
    console.error('Erro ao informar falecimento do pet:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

export default petRoutes

