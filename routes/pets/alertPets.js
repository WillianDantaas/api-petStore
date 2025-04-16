import express from 'express'
import path from 'path';

// Table
import Tutor from '../../models/tutor.js';
import Pet from '../../models/pet.js';

import haversineDistance from '../../utils/haversineDistance.js';

const alertPets = express.Router()

/**
 * POST /lost/:petId
 * Informa o desaparecimento do Pet
 */
alertPets.post('/alert/lost/:petId', async (req, res) => {
    const { petId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude e longitude são obrigatórias' });
    }

    try {
        const pet = await Pet.findByPk(petId);

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }

        if (pet.lost_alert_active) {
            return res.status(400).json({ message: 'Este pet já está marcado como perdido.' });
        }

        if (pet.lost_alert_disabled) {
            return res.status(400).json({ message: 'O alerta de perda foi desativado para este pet.' });
        }

        // Atualiza os dados do pet para perdido
        await pet.update({
            lost_alert_active: true,
            lost_alert_triggered_at: new Date(),
            alert_latitude: latitude,
            alert_longitude: longitude,
        });

        res.json({ message: 'Pet marcado como perdido com sucesso!', pet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar status do pet.' });
    }
});

/**
 * @route PATCH /pets/alert/found/:petId
 * @desc  Marca o pet como encontrado, desativando o alerta perdido
 */
alertPets.patch('/alert/found/:petId', async (req, res) => {
    const { petId } = req.params;
  
    try {
      // Busca o pet pelo ID
      const pet = await Pet.findByPk(petId);
  
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado' });
      }
  
      // Verifica se o pet está marcado como perdido
      if (!pet.lost_alert_active) {
        return res.status(400).json({ message: 'Este pet não está marcado como perdido.' });
      }
  
      // Atualiza os campos para marcar o pet como encontrado
      await pet.update({
        lost_alert_active: false,         // O pet não está mais perdido
        lost_alert_triggered_at: null,      // Limpa a data do alerta
        alert_latitude: null,               // Limpa a localização do alerta
        alert_longitude: null,              // Limpa a localização do alerta
        lost_alert_disabled: false,         // Permite futuros alertas, se necessário
      });
  
      res.json({
        message: 'Pet marcado como encontrado com sucesso!',
        pet,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar status do pet.' });
    }
  });

/**
 * GET alert//lost
 * Rota para buscar pets perdidos com distância calculada de 2km
 */
alertPets.get('/alert/lost', async (req, res) => {
    const { user_latitude, user_longitude, max_distance = 2000 } = req.query;
    // max_distance em METROS (padrão: 2000 m = 2 km)
  
    if (!user_latitude || !user_longitude) {
      return res.status(400).json({ message: 'Localização do usuário é obrigatória' });
    }
  
    try {
      // Buscar apenas os pets que estão perdidos
      const lostPets = await Pet.findAll({
        where: { lost_alert_active: true },
        attributes: [
          'id',
          'name',
          'species',
          'breed',
          'image',
          'alert_latitude',
          'alert_longitude',
          'lost_alert_triggered_at',
        ],
      });
  
      const petsWithDistance = lostPets
        .map((pet) => {
          if (!pet.alert_latitude || !pet.alert_longitude) return null;
  
          const distance = haversineDistance(
            parseFloat(user_latitude),
            parseFloat(user_longitude),
            parseFloat(pet.alert_latitude),
            parseFloat(pet.alert_longitude),
            true // Sempre retorna em METROS
          );
  
          // Se o campo image não é uma URL, converte o caminho local para uma URL pública
          let formattedImage = pet.image;
          if (pet.image && !pet.image.startsWith("http")) {
            const filename = path.basename(pet.image);
            formattedImage = `${process.env.API_URL}/uploads/${filename}`;
          }
  
          return {
            id: pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            image: formattedImage,
            alert_latitude: pet.alert_latitude,
            alert_longitude: pet.alert_longitude,
            lost_alert_triggered_at: pet.lost_alert_triggered_at,
            distance: Math.round(distance), // Distância em metros, sem casas decimais
          };
        })
        .filter((pet) => pet !== null && pet.distance <= parseFloat(max_distance));
  
      // Ordenar por distância (mais próximos primeiro)
      petsWithDistance.sort((a, b) => a.distance - b.distance);
  
      res.json(petsWithDistance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar pets perdidos' });
    }
  });

export default alertPets