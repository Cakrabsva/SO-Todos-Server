'use strict'
const router = require('express').Router()
const UserController = require('../controllers/UserController')
const { authentication, authorization } = require('../helpers/oauthProtection')

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(authentication)
router.get('/:id', authorization, UserController.getUser)
router.post('/:id/update', authorization, UserController.updateUser)

module.exports = router