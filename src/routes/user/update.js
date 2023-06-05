const { UniqueConstraintError, ValidationError } = require('sequelize')
const auth = require('../../auth/auth')
const { User } = require('../../db/sequelize')
const bcrypt = require('bcrypt')

module.exports = (app) => {
    app.put('/api/user/update/:id', auth, (req, res) => {
        const id = req.params.id
        bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {
            req.body.password = hashedPassword
            User.update(req.body, {
                where: {id: id}
            })
            .then(_ => {
                return User.findByPk(id)
                .then(user => {
                    if(user == null){
                        const message = `User doesn't exist.`
                        res.status(400).json({message: message})
                    }
                    const message = `User updated successfully ! `
                    res.json({message: message, data: user})
                })
            })
            .catch(error => {
                if(error instanceof UniqueConstraintError){
                    return res.status(500).json({message: error.message, data: error})
                }
                if(error instanceof ValidationError){
                    return res.status(500).json({message: error.message, data: error})
                }
                const message = `User can't be updated !`
                res.status(500).json({message: message, data: error})
            })
        })
    })
}