'use strict'
const { Todos } = require ('../models')

class TodoController {
    static async getTodo (req, res, next) {
        const {id} = req.params
        try {
            const todo = await Todos.findByPk(id)
            if(!todo) {
                throw new Error ('Todo Not Found')
            }
            res.send(todo)
        } catch (err) {
            err.message === 'Todo Not Found' ?
            next({name: 'Not Found', message: err.message}) :
            next(err)
        }
    }

    static async updateTodo (req, res, next) {
        try {
            const {id} = req.params
            const {todo, description, status, category} = req.body
            await Todos.update({
                todo, description, status, category, updatedAt: new Date()
            },{where: {
                id
            }
        })
        res.send("Updated")
        } catch (err) {
            next(err)
        }
    }

    static async addTodo (req, res, next) {
        const {id} = req.params
        const {todo, description, status, category, due_date} = req.body
        
        try{
            await Todos.create ({
                todo, description, status, category, UserId:id, due_date
            }) 
            res.send('Added')
        } catch (err) {
            next(err)
        }
    }

    static async deleteTodo (req, res, next) { 
        try{
            const {id} = req.params
            const deleted = await Todos.destroy({
                where: {id}
            })
            if (deleted === 0) {
                return next({ name: 'Not Found', message: 'Todo Not Found' });
            }
            res.send('deleted')
        }catch (err){
            next(err)
        }
    }

}

module.exports = TodoController