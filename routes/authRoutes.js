import express from 'express';

import jwt from 'jsonwebtoken';
import Tutor from '../models/tutor.js'

import encryption from '../utils/encryption.js'


const authRoutes = express.Router()

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

    if (error.name === 'SequelizeValidationError') {
      // Se for um erro de validação, extrai a mensagem do erro e repassa
      const validationErrors = error.errors.map(err => err.message);
      console.log(error)
      return res.status(400).json({ errors: validationErrors });

    }

    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota para login
authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail ou Senha não fornecidos' });
  }

  try {

    const user = await Tutor.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Verificar se a senha fornecida é válida
    const isPasswordValid = await encryption.comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Gerar o token de acesso
    const accessToken = jwt.sign({ id: user.id, user: user.user }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Gerar o refresh token
    const refreshToken = jwt.sign({ id: user.id, user: user.user }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    // Armazenar o refresh token no banco de dados
    try {
      await user.update({ refresh_token: refreshToken });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' })
    }

    // Retornar os tokens para o cliente
    return res.status(200).json({ accessToken, refreshToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
})

authRoutes.post('/logout', async (req, res) => {
  const authHeader = req.headers['authorization']; // Obtem o header Authorization
  const token = authHeader && authHeader.split(' ')[1]; // Pega apenas o token (sem o Bearer)

  if (!token) {
    return res.status(401).json({ error: 'Token de autorização é obrigatório.' });
  }

  try {
    // Valida o token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Localiza o usuário pelo ID do token decodificado
    const user = await Tutor.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    // Remove o refresh token do banco
    await user.update({ refresh_token: null });

    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado. Faça login novamente.' });
    }
    return res.status(403).json({ error: 'Token inválido.' });
  }
})

// Rota para renovar o token
authRoutes.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token não fornecido' });
  }

  try {
    // Verificar se o refresh token é válido
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Buscar o usuário com base no ID armazenado no refresh token
    const user = await Tutor.findOne({ where: { id: decoded.id } });

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado' });
    }

    const newAccessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    await user.update({ refreshToken: newAccessToken })

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Erro ao renovar o token' });
  }
})



export default authRoutes