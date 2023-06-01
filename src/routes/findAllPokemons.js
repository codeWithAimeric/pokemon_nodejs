const { Op } = require('sequelize')
const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth')

  
module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => { 
        if(req.query.name){
            const name = req.query.name
            if(name.length > 1){
                const limit = parseInt(req.query.limit) || 5
                return Pokemon.findAndCountAll({
                    where: {
                        name: {     // 'name' est la propriété du modèle pokémon
                            [Op.like]: `%${name}%`   // 'name' est le critère de la recherche
                        }
                    }, 
                    order: ['name'],
                    limit: limit
                })
                .then(({count, rows}) => {
                    const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}`
                    res.json({message, data: rows})
                })
            }else{
                const message = `Le terme de recherche doit contenir au minimum 2 caractères.`
                return res.status(404).json({message})
            }
        }else{
            Pokemon.findAll({ order: ['name'] })
            .then(pokemons => {
                const message = 'La liste des pokémons a bien été récupérée.'
                res.json({ message, data: pokemons })
            })
            .catch(error => {
                const message = `La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants.`
                res.status(500).json({message, data: error})
            })
        }
    })
}