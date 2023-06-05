const { User } = require('../../db/sequelize');
const auth = require('../../auth/auth');
const { UniqueConstraintError, ValidationError } = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (app) => {
    app.post('/api/user/create', auth, (req, res) => {
        bcrypt.hash(req.body.password, 10)
        .then((hashedPassword) => {
            req.body.password = hashedPassword;
            User.create(req.body)
            .then((user) => {
                const message = `User created successfully ${req.body.name}`
                res.json({message, data: user})
            })
            .catch(error => {
                if(error instanceof UniqueConstraintError){
                    return res.status(400).json({message: error.message, data: error})
                }
                if(error instanceof ValidationError){
                    return res.status(400).json({message: error.message, data: error})
                }
                const message = `An error occured when creating the user`;
                res.status(500).json({message: message, data: error})
            })
        })
    })
}