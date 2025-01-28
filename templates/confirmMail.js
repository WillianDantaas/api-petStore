import format from "../utils/format.js"

export function sendConfirmMail(username, confirmLink) {
    return `<!DOCTYPE html>
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
        <h1 class="title">CONFIRME SEU EMAIL</h1>
        <p class="content">Olá, ${format.capitalizeName(username)},</p>
        <p class="content">
          Você acaba de se registrar no SirPet, desta forma, precisamos que confirme seu e-mail!<br>
          Se não se registrou, simplesmente ignore este email. Caso contrário, clique no botão para confirmar seu e-mail:
        </p>
        <a href="${confirmLink}" class="button">Confirmar Email</a>
        <p class="footer">
          Este é um e-mail automático. Por favor, não responda.
        </p>
      </div>
    </body>
    </html>`
}
