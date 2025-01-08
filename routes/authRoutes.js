import express from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Tutor from '../models/tutor.js';  // Importando o modelo Tutor



const authRoutes = express.Router()

// Rota para login
authRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscando o usuário pelo username (no caso, utilizamos 'document' como exemplo)
    const user = await Tutor.findOne({ where: { document: username } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Verificar se a senha fornecida é válida
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Gerar o token de acesso
    const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Gerar o refresh token
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    // Armazenar o refresh token no banco de dados
    await user.update({ refresh_token: refreshToken });

    // Retornar os tokens para o cliente
    res.status(200).json({ accessToken, refreshToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
})

// Rota para cadastro
authRoutes.post('/register', (req, res) => {
  
})

// Exportar o router
export default authRoutes