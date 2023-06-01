const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const pokemons = require('./mock-pokemon')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
  
const sequelize = new Sequelize('pokedex', 'root', 'Aimeric.77', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT+3',
  },
  logging: false
})
  
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = userModel(sequelize, DataTypes)
  
const initDb = () => {
  return sequelize.sync().then(_ => {
    pokemons.map(pokemon => {
      // Pokemon.create({
      //   name: pokemon.name,
      //   hp: pokemon.hp,
      //   cp: pokemon.cp,
      //   picture: pokemon.picture,
      //   types: pokemon.types
      // }).then(pokemon => console.log(pokemon.toJSON()))
   
    })
    // bcrypt.hash('secret', 10)
    //   .then(hash => { User.create({ username: 'doe', password: hash })
    // })

    // User.create({
    //   username: 'john', 
    //   password: 'secret'
    // })
    // .then(user => console.log(user.toJSON()))

    console.log('La base de donnée a bien été initialisée !')
    
  })

}
  
module.exports = { 
  initDb, Pokemon, User
}