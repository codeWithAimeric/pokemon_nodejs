const { User } = require('../../db/sequelize')
const auth = require('../../auth/auth')

module.exports = (app) => {
    app.get('/api/user/:id', auth, (req, res) => {
        User.findByPk(req.params.id)
        .then((user) => {
            if(user == null){
                const message = `User doesn't exist !`
                return res.status(400).json({message: message})
            }
            const message = `User foud successfully ! `
            return res.json({message: message, data: user})
        })
        .catch(error => {
            const message = `User can't be found ! `
            res.status(500).json({message: message, data: error})
        })
    })
}