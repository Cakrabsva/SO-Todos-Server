'use strict'

let jwt = require('jsonwebtoken')

class Jwt {
    static getToken (data) {
        return jwt.sign(data, process.env.JWT_SECRET_KEY)
    }

    static verifyToken (token){
        return jwt.verify(token, process.env.JWT_SECRET_KEY)
    }
}

module.exports = {Jwt}