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
authRoutes.post('/register', async (req, res) => {
  const {
    name,
    document,
    email,
    contact,
    password,
    address,
    number,
    complement,
    neighborhood,
    city,
    state,
    cep
  } = req.body;

  try {
    // Verificar se o tutor já existe pelo email
    const existingTutor = await Tutor.findOne({ where: { email } });
    if (existingTutor) {
      return res.status(400).json({ error: 'Tutor já registrado com este email.' });
    }

    const existingTutorDocument = await Tutor.findOne({ where: { document } });
    if (existingTutorDocument) {
      return res.status(400).json({ error: 'Tutor já registrado com este documento.' });
    }

    // Criar um novo tutor
    const newTutor = await Tutor.create({
      name,
      document,
      email,
      contact,
      password,
      address,
      number,
      complement,
      neighborhood,
      city,
      state,
      cep,
    })

    // Retornar uma resposta de sucesso
    return res.status(201).json({
      message: 'Tutor registrado com sucesso.',
      tutor: {
        id: newTutor.id,
        name: newTutor.name,
        email: newTutor.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

export default authRoutes