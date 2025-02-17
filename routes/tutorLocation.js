// routes/tutorLocation.js
import express from 'express';
import Tutor from '../models/tutor.js';
import { verifyToken } from '../middlewares/auth.js'; // Middleware para validar o token

const tutorLocation = express.Router();

/**
 * Rota: PUT /tutors/location
 * Descrição: Atualiza a localização (latitude e longitude) do tutor logado.
 * Requer: Token de autenticação.
 * Body: { latitude: <number|string>, longitude: <number|string> }
 */
tutorLocation.put('/location', verifyToken, async (req, res) => {
  try {
    const tutorId = req.user.id; // Assume que o middleware de autenticação adiciona req.user
    const { latitude, longitude } = req.body;

    // Valida se os campos foram enviados
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        error: "Os campos 'latitude' e 'longitude' são obrigatórios."
      });
    }

    // Converte para número e valida
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({
        error: "Os campos 'latitude' e 'longitude' devem ser numéricos."
      });
    }

    // Atualiza o tutor com a nova localização
    await Tutor.update(
      { latitude: latNum, longitude: lonNum },
      { where: { id: tutorId } }
    );

    return res.status(200).json({
      message: "Localização atualizada com sucesso."
    });
  } catch (error) {
    console.error("Erro ao atualizar localização:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

export default tutorLocation;
