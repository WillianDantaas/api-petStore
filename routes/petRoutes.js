import express from 'express'
const petRoutes = express.Router()


petRoutes.get('/', (req, res) => {
    res.send('Pet Router Inital')
})

export default petRoutes