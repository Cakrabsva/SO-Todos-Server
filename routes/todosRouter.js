'use strict'
const router = require('express').Router()
const TodoController = require('../controllers/TodoController')
const { authentication, authorization, todosAuthorization } = require('../helpers/oauthProtection')

router.use(authentication)
router.get('/:id', todosAuthorization, TodoController.getTodo)
router.post('/:id/update', todosAuthorization, TodoController.updateTodo)
router.post('/:id/add', authorization, TodoController.addTodo)
router.delete('/:id/delete', todosAuthorization, TodoController.deleteTodo)

module.exports = router