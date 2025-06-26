const router = require ('express').Router()

router.use('/user', require('./usersRouters'))
router.use('/todo', require('./todosRouter'))

module.exports = router