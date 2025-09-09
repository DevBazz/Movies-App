const express = require('express')
const { createUser, loginUser, logoutUser, getAllUsers, getSpecficUser, updateUser } = require('../controllers/userController')
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', createUser)
router.post('/auth', loginUser)
router.post('/logout', logoutUser)

router.get('/', authenticate, authorizeAdmin, getAllUsers)
router.get('/profile', authenticate, getSpecficUser)

router.put('/profile', authenticate, updateUser)

module.exports = router