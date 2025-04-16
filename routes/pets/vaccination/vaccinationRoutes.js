import express from 'express';
import Vaccination from '../../../models/Vaccination.js';
import Pet from '../../../models/pet.js';

const vaccinationRoutes = express.Router();

//Registro de vacinas
vaccinationRoutes.post('/vaccinations', async (req, res) => {
    const {
      petId,
      vaccineName,
      dateAdministered,
      expirationDate,
      doses,       // opcional
      notes        // opcional
    } = req.body;
  
    // Valida campos obrigatórios
    if (!petId || !vaccineName || !dateAdministered || !expirationDate) {
      return res.status(400).json({
        error: "Os campos 'petId', 'vaccineName', 'dateAdministered' e 'expirationDate' são obrigatórios."
      });
    }
  
    // Valida datas
    const administeredDate = Date.parse(dateAdministered);
    const expDate = Date.parse(expirationDate);
    if (isNaN(administeredDate) || isNaN(expDate)) {
      return res.status(400).json({ error: 'Datas inválidas. Utilize um formato de data válido.' });
    }
    if (expDate <= administeredDate) {
      return res.status(400).json({ error: 'A data de vencimento deve ser posterior à data de administração.' });
    }
  
    try {
      // Verifica se o pet existe
      const pet = await Pet.findByPk(petId);
      if (!pet) {
        return res.status(404).json({ error: 'Pet não encontrado.' });
      }
  
      // Cria o registro de vacinação
      const newVaccination = await Vaccination.create({
        petId,
        vaccineName,
        dateAdministered,
        expirationDate,
        doses: doses || null,
        notes: notes || null,
        notificationSent: false, // padrão false
      });
  
      return res.status(201).json(newVaccination);
    } catch (error) {
      console.error('Erro ao criar registro de vacinação:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  });
  
  /**
   * GET /vaccinations/:petId
   * Lista todas as vacinações de um pet.
   */
  vaccinationRoutes.get('/vaccinations/:petId', async (req, res) => {
    const { petId } = req.params;
  
    try {
      // Verifica se o pet existe
      const pet = await Pet.findByPk(petId);
      if (!pet) {
        return res.status(404).json({ error: 'Pet não encontrado.' });
      }
  
      // Busca todas as vacinações associadas ao pet
      const vaccinations = await Vaccination.findAll({ where: { petId } });
      return res.status(200).json(vaccinations);
    } catch (error) {
      console.error('Erro ao consultar vacinações:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  });
  
  /**
   * PUT /vaccinations/:id
   * Atualiza um registro de vacinação.
   */
  vaccinationRoutes.put('/vaccinations/:id', async (req, res) => {
    const { id } = req.params;
    const { vaccineName, dateAdministered, expirationDate, doses, notes } = req.body;
  
    // Validação dos campos obrigatórios
    if (!vaccineName || !dateAdministered || !expirationDate) {
      return res.status(400).json({
        error: "Os campos 'vaccineName', 'dateAdministered' e 'expirationDate' são obrigatórios."
      });
    }
  
    const administeredDate = Date.parse(dateAdministered);
    const expDate = Date.parse(expirationDate);
    if (isNaN(administeredDate) || isNaN(expDate)) {
      return res.status(400).json({ error: 'Datas inválidas. Utilize um formato de data válido.' });
    }
    if (expDate <= administeredDate) {
      return res.status(400).json({ error: 'A data de vencimento deve ser posterior à data de administração.' });
    }
  
    try {
      const vaccination = await Vaccination.findByPk(id);
      if (!vaccination) {
        return res.status(404).json({ error: 'Registro de vacinação não encontrado.' });
      }
  
      // Atualiza os campos do registro
      vaccination.vaccineName = vaccineName;
      vaccination.dateAdministered = dateAdministered;
      vaccination.expirationDate = expirationDate;
      vaccination.doses = doses || null;
      vaccination.notes = notes || null;
      await vaccination.save();
  
      return res.status(200).json(vaccination);
    } catch (error) {
      console.error('Erro ao atualizar registro de vacinação:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  });


  export default vaccinationRoutes;