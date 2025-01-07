import express from 'express';
const authRoutes = express.Router()

// Rota para login
authRoutes.post('/login', (req, res) => {
  const { username, password } = req.body

  res.json({username})
})

// Rota para cadastro
authRoutes.post('/register', (req, res) => {
  res.send('Página de Cadastro');
})

// Exportar o router
export default authRoutes