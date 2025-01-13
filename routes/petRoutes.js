import express from 'express'

// Table
import Tutor from '../models/tutor.js';

const petRoutes = express.Router()

app.post('/pets', async (req, res) => {
    const { name, breed, age, microchip, tutorId } = req.body;
  
    try {
      const tutor = await Tutor.findByPk(tutorId);
  
      if (!tutor) {
        return res.status(404).json({ error: 'Tutor não encontrado' });
      }
  
      const petCount = await Pet.count({ where: { tutorId } });
  
      if (petCount >= tutor.petLimit) {
        return res.status(400).json({ error: 'Limite de pets atingido' });
      }
  
      // Timestamp atual + ID do tutor para garantir unicidade
      const rg = `${Date.now()}${tutorId}`;
      if(!microchip) {
        microchip = null
      }
  
      const newPet = await Pet.create({ name, breed, age, microchip, rg, tutorId });
  
      return res.status(201).json(newPet);
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
  

// Alterar limites de pets por tutor individualmente
app.put('/tutors/:id/petLimit', async (req, res) => {
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

