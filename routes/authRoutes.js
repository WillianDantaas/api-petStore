import express from 'express';
import jwt from 'jsonwebtoken';
import Tutor from '../models/tutor.js';
import encryption from '../utils/encryption.js';
import verifyToken from '../middlewares/verifyToken.js';

//Gerar tokens
import tokens from '../utils/tokens.js'

// Nodemailer
import sendMail from '../services/sendMail.js';
import { sendResetPassMail } from '../templates/resetPassword.js'
import { sendConfirmMail } from '../templates/confirmMail.js'

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

    const confirmationToken = tokens.generateToken()
    const dateNow = new Date()
    const confirmationTokenExpires = new Date(dateNow.getTime() + 24 * 60 * 60 * 1000);

    const newTutor = await Tutor.create({
      name,
      email,
      password,
      confirmationToken,
      confirmationTokenExpires
    })

    // Enviar e-mail com o link
    const confirmLink = `${process.env.DOMAIN_FRONTEND}a/confirm-mail?token=${confirmationToken}`;

    await sendMail(email, 'SirPet: Confirme seu Email',
      sendConfirmMail(name, confirmLink));

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

    return res.status(500).json({ error: 'Erro interno do servidor.'});
  }
});

// Confirmar email do cadastro
authRoutes.post('/confirm-mail', async (req, res) => {

  const { token } = req.query; // Extrai o token da URL
  if (!token) {
    return res.status(400).json({ error: 'Token não fornecido' });
  }

})

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


// Alteração de Senha/Esqueci minha senha
authRoutes.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O campo email é obrigatório' });
  }

  try {
    const user = await Tutor.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const token = tokens.generateToken();

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30); // Expira em 30 minutos
    await user.update({ resetToken: token, resetTokenExpires: expiration });

    // Enviar e-mail com o link
    const resetLink = `${process.env.DOMAIN_FRONTEND}a/reset-password?token=${token}`;
    await sendMail(user.email, 'SirPet: Redefinição de Senha',

      sendResetPassMail(user.name, resetLink));

    return res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
})

// Confirmação do token de reset password
authRoutes.get('/confirm', async (req, res) => {
  const token = req.query.token;

  // Validação inicial do token
  if (!token) {
    return res.status(400).json({ error: 'O token é obrigatório' });
  }

  try {
    const user = await Tutor.findOne({ where: { resetToken: token } });

    if (!user) {
      return res.status(404).json({ error: 'Token inválido ou usuário não encontrado' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao confirmar token:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// redefinir senha
authRoutes.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body; // A nova senha vem no corpo da requisição

  try {
    // Validação inicial
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }

    // Verificar se o token existe e é válido
    const user = await Tutor.findOne({ where: { resetToken: token } });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou usuário não encontrado' });
    }

    // Verificar se o token expirou
    if (user.resetTokenExpires < new Date()) {
      return res.status(400).json({ error: 'O token expirou. Solicite uma nova redefinição de senha.' });
    }

    user.password = newPassword;
    user.changed('password', true); // Força a marcação do campo como alterado
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
})

export default authRoutes;
