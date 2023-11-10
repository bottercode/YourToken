'use strict'

import express from 'express'
import userRoutes from './api/routes/userRoute.js'
const app = express()

app.use(express.json())
app.use('/api', userRoutes)

export default app
