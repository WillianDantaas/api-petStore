import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: '9eb07e15cefe5d',
    pass: '79c422a32a2b14',
  },
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Endereço de envio
      to, 
      subject, 
      html,
    });
    console.log('E-mail enviado com sucesso!');
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    throw new Error('Falha ao enviar o e-mail');
  }
};

export default sendMail;
