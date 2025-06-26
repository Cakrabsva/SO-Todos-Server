'use strict'

const { Jwt } = require("./jwt")
const {Users, Todos} = require('../models')

async function authentication (req, res, next) {
    try {
        const bearerToken = req.headers.authorization
        if (!bearerToken) {
            next({name: 'unauthorized'})
            return
        }
        
        const token = bearerToken.split(' ')[1]
        const decodedToken = Jwt.verifyToken(token)
        const user = await Users.findByPk(decodedToken.id, {
            include: {
                    model: Todos
                }
            })

        if(!user) {
            next({name: 'unauthorized'})
            return
        }

        req.user = user
        next()

    } catch (err) {
        next(err)
    }
}

async function authorization(req, res, next) {
    try {
        let userLoginId = req.user.id
        let idRequest = req.params.id
        userLoginId !== +idRequest ? next ({name: 'Forbidden'}) :
        next()
    } catch (err) {
        next(err)
    }
}

async function todosAuthorization (req, res, next) {
    try {
        let id = req.params.id
        let todo = await Todos.findByPk(id)

        if(!todo) {
            return next({name: 'Not Found', message: 'todo not found'})
        }

        if(todo.UserId == req.user.id) {
            next()
        } else {
            next ({name: 'Forbidden'})
        }

    } catch (err) {
        next(err)
    }
}

module.exports = {authentication, authorization, todosAuthorization}