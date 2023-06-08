const { ValidationError, UniqueConstraintError } = require('sequelize')
const { Pokemon } = require('../../db/sequelize')
const auth = require('../../auth/auth')
  
module.exports = (app) => {
    app.post('/api/pokemons', auth, (req, res) => {
        const userId =  (req.body.hasOwnProperty('userId') && typeof(req.body.userId) != 'undefined') ? parseInt(req.body.userId) : req.user.id
        const pokemonData = {
            ...req.body,
            userId: userId
        }
        Pokemon.create(pokemonData)
        .then(pokemon => {
            const message = `Le pokémon ${req.body.name} a bien été crée.`
            res.json({ message, data: pokemon })
        })
        .catch(error => {
            if(error instanceof ValidationError){
                return res.status(400).json({message: error.message, data: error})
            }
            if(error instanceof UniqueConstraintError){
                return res.status(400).json({message: error.message, data: error})
            }
            const message = `Le pokémon n'a pas pu être ajoutée.`
            res.status(500).json({message, data: error})
        })
    })
}