'use strict'

const streamifier = require('streamifier') // Add this line
const { comparePass } = require('../helpers/hashPassword')
const { Jwt } = require('../helpers/jwt')
const { Users, Todos } = require ('../models')
const { getImagePublicId } = require('../helpers/formatDate')

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
            const { first_name, last_name, profile_picture, description, gender} = req.body

            await Users.update({
                 first_name, last_name, profile_picture, description, gender, update: new Date()
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

    static async updateProfilePic (req, res, next) {
        try {
            const cloudinary = require('cloudinary').v2
             cloudinary.config({ 
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
                api_key: process.env.CLOUDINARY_API_KEY, 
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            // Use upload_stream for buffers
            const fileName = req.file.originalname
            const uploadStream = cloudinary.uploader.upload_stream(
                { public_id: fileName }, // Options for Cloudinary upload
                async (error, result) => {
                    if (error) {

                        return next({name: "Bad Request", message:error}); // Pass the error to the Express error handler
                    }
                    const optimizeUrl = cloudinary.url(fileName, {
                            fetch_format: 'auto',
                            quality: 'auto'
                        });
                    const {id} = req.params
                    let data = await Users.findByPk(id)
                    let lastProfileImgUrl = data.profile_picture

                    if(!lastProfileImgUrl) {
                        await Users.update({
                            profile_picture:optimizeUrl
                        }, {
                            where: {id}
                        })
                        res.status(200).json('User Updated')
                    } else {
                        let publicId = getImagePublicId (lastProfileImgUrl)
                        cloudinary.uploader.destroy(publicId)
                        //process update database
                        await Users.update({
                            profile_picture:optimizeUrl
                        }, {
                            where: {id}
                        })
                        res.status(200).json('User Updated')
                    }                    
                }
            );

            // Pipe the buffer from req.file to the Cloudinary upload stream
           streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

        } catch (err) {
            console.error("Error in updateProfilePic:", err);
            next(err);
        }
    }
}

module.exports = UserController