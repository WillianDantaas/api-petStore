import express from 'express'

import verifyToken from '../middlewares/verifyToken.js'
const petRoutes = express.Router()


petRoutes.get('/', verifyToken,(req, res) => {
    res.send('Pet Router Inital')
})

export default petRoutes