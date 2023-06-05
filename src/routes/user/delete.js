const auth = require('../../auth/auth')
const {User} = require('../../db/sequelize')

module.exports = (app) => {
    app.delete('/api/user/delete/:id', auth, (req, res) => {
        User.findByPk(req.params.id)
        .then((us) => {
            if(us == null){
                const message = `User doesn't exist !`
                return res.status(400).json({message: message, data: us})
            }
            return User.destroy({
                where: {id: req.params.id}
            })
            .then(_ => {
                const message = `User deleted successfully ! `
                res.json({message: message, data: us})
            })            
        })
        .catch(error => {
            const message = `User can't be deleted !`
            res.status(500).json({message: message, data: error})
        })
    })
}