'use strict'
const bcrypt = require ("bcryptjs");

function hashPassword (password) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

function comparePass (inputPassword, hashPass) {
    return bcrypt.compareSync(inputPassword, hashPass)
}

module.exports = {hashPassword, comparePass}