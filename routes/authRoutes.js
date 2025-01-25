import express from 'express';
import jwt from 'jsonwebtoken';
import Tutor from '../models/tutor.js';
import encryption from '../utils/encryption.js';
import verifyToken from '../middlewares/verifyToken.js';

const authRoutes = express.Router();

// Configuração dos tempos de expiração
const ACCESS_TOKEN_EXPIRATION = '1m'; // Expiração mais longa para evitar renovações frequentes
const REFRESH_TOKEN_EXPIRATION = '7d'; // Tempo de expiração do Refresh Token


// Rota para cadastro
authRoutes.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;

  try {
    // Verificar se o tutor já existe pelo email
    const existingTutor = await Tutor.findOne({ where: { email } });
    if (existingTutor) {
      return res.status(400).json({ error: 'Tutor já registrado com este email.' });
    }

    // const existingTutorDocument = await Tutor.findOne({ where: { document } });
    // if (existingTutorDocument) {
    //   return res.status(400).json({ error: 'Tutor já registrado com este documento.' });
    // }

    // Criar um novo tutor
    
    const newTutor = await Tutor.create({
      name,
      email,
      password,
    })

    // Retornar uma resposta de sucesso
    return res.status(201).json({
      message: 'Tutor registrado com sucesso.',
      tutor: {
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
    const user = await Tutor.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const isPasswordValid = await encryption.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    // Gerar tokens
    const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    let refreshToken = user.refresh_token;

    // Se o usuário não tiver um refresh token ou ele expirou, cria um novo
    if (!refreshToken) {
      refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
      await user.update({ refresh_token: refreshToken });
    }

    return res.status(200).json({ accessToken, refreshToken, tutorID: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// Rota para renovar o token
authRoutes.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token não fornecido' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await Tutor.findOne({ where: { id: decoded.id } });

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado' });
    }

    // Verifica se é necessário atualizar o Refresh Token (opcional)
    const now = Math.floor(Date.now() / 1000);
    const refreshTokenExp = decoded.exp;
    let newRefreshToken = refreshToken;

    // Atualiza o refresh token apenas se faltarem menos de 24 horas para expirar
    if (refreshTokenExp - now < 24 * 60 * 60) {
      newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
      await user.update({ refresh_token: newRefreshToken });
    }

    const newAccessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error('Erro ao verificar o refresh token:', err.message);
    res.status(403).json({ error: 'Erro ao renovar o token' });
  }
});

// Rota para logout
authRoutes.post('/logout', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autorização é obrigatório.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await Tutor.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    await user.update({ refresh_token: null });

    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado. Faça login novamente.' });
    }
    return res.status(403).json({ error: 'Token inválido.' });
  }
});

export default authRoutes;
