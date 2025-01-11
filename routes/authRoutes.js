import express from 'express';

import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import jwt from 'jsonwebtoken';
import Tutor from '../models/tutor.js'

import sendEmail from '../utils/sendEmail.js';



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
    const isPasswordValid = await bcrypt.compare(password, user.password);

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

    const token = crypto.randomBytes(32).toString('hex');

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 30); // Expira em 30 minutos
    await user.update({ resetToken: token, resetTokenExpires: expiration });

    // Enviar e-mail com o link
    const resetLink = `http://localhost:8080/a/reset-password?token=${token}`;
    await sendEmail(user.email, 'Redefinição de Senha',

      `<!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Esqueceu Sua Senha</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #FAFAFA;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #FFFFFF;
            padding: 20px;
            text-align: center;
          }
          .header img {
            max-width: 175px;
            height: auto;
            margin-bottom: 20px;
          }
          .title {
            font-size: 20px;
            color: #333333;
            margin: 0;
          }
          .content {
            font-size: 16px;
            color: #666666;
            line-height: 1.5;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #FFFFFF;
            background-color: #3D5CA3;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://elqseyu.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png" alt="Logo">
          </div>
          <h1 class="title">ESQUECEU SUA SENHA?</h1>
          <p class="content">Olá, ${user.name.split(' ')[0].toUpperCase()},</p>
          <p class="content">
            Houve uma solicitação para alterar sua senha!<br>
            Se não fez este pedido, simplesmente ignore este email. Caso contrário, clique no botão abaixo para alterar sua senha:
          </p>
          <a href="${resetLink}" class="button">Alterar Senha</a>
          <p class="footer">
            Este é um e-mail automático. Por favor, não responda.
          </p>
        </div>
      </body>
      </html>`);

    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
})

authRoutes.post('/reset-password', async (req, res) => {
  const { token , newPassword } = req.body; // A nova senha vem no corpo da requisição

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
});


export default authRoutes