import express from 'express';

import tokens from '../utils/tokens.js'
import Tutor from '../models/tutor.js'

import sendMail from '../services/sendMail.js';

import { sendResetPassMail } from '../templates/resetPassword.js'

const passRouter = express.Router()


passRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'O campo email é obrigatório' });
    }

    try {
        const user = await Tutor.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const token = tokens.generateToken().toString('hex');

        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 30); // Expira em 30 minutos
        await user.update({ resetToken: token, resetTokenExpires: expiration });

        // Enviar e-mail com o link
        const resetLink = `http://localhost:8080/a/reset-password`;
        await sendMail(user.email, 'Redefinição de Senha',

            sendResetPassMail(user.name, resetLink));

        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao processar solicitação' });
    }
})


passRouter.get('/confirm', async (req, res) => {
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


passRouter.post('/reset-password', async (req, res) => {
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

export default passRouter