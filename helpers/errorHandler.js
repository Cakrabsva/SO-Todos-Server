'use strict'

function errorHandler (err, req, res, next) {
    switch (err.name) {
        case 'unauthorized':
            return res.status(401).json({message: 'Invalid Token'})
        case 'Forbidden':
            return res.status(403).json({message: 'You are not authorized'})
        case "SequelizeValidationError":
            case "SequelizeUniqueConstraintError":
            return res.status(400).json({message: err.message})
        case "Bad Request":
            return res.status(401).json({message: err.message})
        case "Not Found":
            return res.status(404).json({message: err.message})
        default:
            console.log(err)
            res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = errorHandler