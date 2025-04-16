import express from 'express';
import MedicalHistory from '../../../models/MedicalHistory.js';
import Pet from '../../../models/pet.js';

const medicalHistoryRoutes = express.Router();

// Registro de histórico médico
medicalHistoryRoutes.post('/medical-history', async (req, res) => {
  const { petId, date, description, notes } = req.body;

  // Valida campos obrigatórios
  if (!petId || !date || !description) {
    return res.status(400).json({
      error: "Os campos 'petId', 'date' e 'description' são obrigatórios."
    });
  }

  // Valida a data
  const historyDate = Date.parse(date);
  if (isNaN(historyDate)) {
    return res.status(400).json({ error: 'Data inválida. Utilize um formato de data válido.' });
  }

  try {
    // Verifica se o pet existe
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }

    // Cria o registro do histórico médico
    const newHistory = await MedicalHistory.create({
      petId,
      date,
      description,
      notes: notes || null,
    });

    return res.status(201).json(newHistory);
  } catch (error) {
    console.error('Erro ao criar histórico médico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

/**
 * GET /medical-history/:petId
 * Lista todos os registros do histórico médico de um pet.
 */
medicalHistoryRoutes.get('/medical-history/:petId', async (req, res) => {
  const { petId } = req.params;

  try {
    // Verifica se o pet existe
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }

    // Busca todos os registros de histórico médico associados ao pet
    const histories = await MedicalHistory.findAll({ where: { petId } });
    return res.status(200).json(histories);
  } catch (error) {
    console.error('Erro ao consultar histórico médico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

/**
 * PUT /medical-history/:id
 * Atualiza um registro do histórico médico.
 */
medicalHistoryRoutes.put('/medical-history/:id', async (req, res) => {
  const { id } = req.params;
  const { date, description, notes } = req.body;

  // Validação dos campos obrigatórios
  if (!date || !description) {
    return res.status(400).json({
      error: "Os campos 'date' e 'description' são obrigatórios."
    });
  }

  const parsedDate = Date.parse(date);
  if (isNaN(parsedDate)) {
    return res.status(400).json({ error: 'Data inválida. Utilize um formato de data válido.' });
  }

  try {
    const history = await MedicalHistory.findByPk(id);
    if (!history) {
      return res.status(404).json({ error: 'Registro de histórico médico não encontrado.' });
    }

    // Atualiza os campos do registro
    history.date = date;
    history.description = description;
    history.notes = notes || null;
    await history.save();

    return res.status(200).json(history);
  } catch (error) {
    console.error('Erro ao atualizar histórico médico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


export default medicalHistoryRoutes;