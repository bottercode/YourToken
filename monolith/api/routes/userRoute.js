'use strict'

import express from 'express'
import User from '../controllers/userController.js'

const router = express.Router()

router.get('/users', User.getUsers)

export default router
