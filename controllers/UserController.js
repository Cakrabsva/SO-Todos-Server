'use strict'

const streamifier = require('streamifier') // Add this line
const { comparePass } = require('../helpers/hashPassword')
const { Jwt } = require('../helpers/jwt')
const { Users, Todos } = require ('../models')
const { getImagePublicId } = require('../helpers/formatDate')
const { firstNameGenerator } = require('../helpers/firstNameGenerator')
const cloudinary = require('cloudinary').v2
const path = require('path');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class UserController {
    static async register (req, res, next) {
        const {username, email, password} = req.body
        try {
            await Users.create({username, email, password, first_name:firstNameGenerator()})
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
            res.status(201).json({token: accessToken, id: user.id})
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
            const { first_name, last_name, profile_picture, email, description, gender} = req.body

            await Users.update({
                 first_name, last_name, profile_picture, description, gender, email, update: new Date()
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
            // Use upload_stream for buffers
            const fileName = path.parse(req.file.originalname).name
            const uploadStream = cloudinary.uploader.upload_stream(
                { public_id: fileName }, // Options for Cloudinary upload
                async (error, result) => {
                    if (error) {
                        return next({name: "Bad Request", message:error}); // Pass the error to the Express error handler
                    }
                    const {id} = req.params
                    let data = await Users.findByPk(id)
                    let lastProfileImgUrl = data.profile_picture
                    
                    if(lastProfileImgUrl) {
                        let publicId = getImagePublicId (lastProfileImgUrl)
                        cloudinary.uploader.destroy(publicId)
                    }
                    const cropPic = cloudinary.url(fileName   , {
                         crop: 'auto',
                         gravity: 'auto',
                         width: 500,
                         height: 500,
                     });
         
                     await Users.update({
                         profile_picture:cropPic
                     }, {
                         where: {id}
                     })
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            res.status(200).json('User Updated')                   
            

        } catch (err) {
            console.error("Error in updateProfilePic:", err);
            next(err);
        }
    }
}

module.exports = UserController