'use strict'
const router = require('express').Router()
const UserController = require('../controllers/UserController')
const { authentication, authorization } = require('../helpers/oauthProtection')
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(authentication)
router.get('/:id', authorization, UserController.getUser)
router.post('/:id/update', authorization, UserController.updateUser)
router.patch('/:id/picture-url', authorization, upload.single('avatar'), UserController.updateProfilePic)

module.exports = router