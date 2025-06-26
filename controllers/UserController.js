'use strict'

const { comparePass } = require('../helpers/hashPassword')
const { Jwt } = require('../helpers/jwt')
const { Users, Todos } = require ('../models')

class UserController {
    static async register (req, res, next) {
        const {username, email, password} = req.body
        try {
            await Users.create({username, email, password})
            res.status(201).json('Successfully Register')
        } catch (err) {
            err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError" ?
            next({name: err.name, message: err.errors[0].message}) :
            next(err)
        }
    }

    static async login (req, res, next) {
        const {username, password} = req.body

        try{
            if (!username) {
                next({name:'Bad Request', message: 'username is require'})
                return
            }
            if (!password) {
                next({name:'Bad Request', message: 'password is require'})
                return
            }

            const user = await Users.findOne({where: {username}})
            if (!user) {
                next({name:'Bad Request', message: 'invalid email/username'})
                return
            }

            const checkingPassword = comparePass(password, user.password)
            if(!checkingPassword) {
                next({name:'Bad Request', message: 'invalid email/username'})
                return
            }

            const accessToken = Jwt.getToken({id: user.id})
            res.status(201).json({message: accessToken})
        }catch(err) {
            next(err)
        }
    }

    static async getUser(req, res, next) {
        const  {id} = req.params
        try {
            const users = await Users.findByPk( id, {
                include: {
                    model: Todos
                }
            });
            if(!users) {
                throw new Error ('User Not Found')
            }
            res.send(users);
        } catch (err) {
            err.message === 'User Not Found' ?
            next({name: 'Not Found', message: err.message}) :
            next(err)
        }
    }

    static async updateUser (req, res, next) {
        try {
            const {id} = req.params
            const {email, first_name, last_name, profile_picture, description, gender} = req.body

            await Users.update({
                email, first_name, last_name, profile_picture, description, gender, update: new Date()
            }, {
                where: {id}
            })
            res.status(200).json('User Updated') 

        }catch (err) {
            err.name === 'SequelizeUniqueConstraintError' ?
            next({name: err.name, message: err.errors[0].message}) :
            next(err)
            
        }
    }
}

module.exports = UserController