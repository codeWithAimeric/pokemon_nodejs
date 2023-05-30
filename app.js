const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const { success, getUniqueId } = require('./helper'); //import directly the 'success' function
let pokemons = require('./mock-pokemon');

const app = express();
const port = 3000;

const sequelize = new Sequelize(
    'pokedex',
    'root',
    'Aimeric.77',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT+3'
        },
        logging: false
    }
);
sequelize
    .authenticate()
    .then(_ => console.log('La connexion a la base de donnée a bien été établie'))
    .catch(error => console.error(`Impossible de se connecter à la base ${error}`));

//middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello, Express !!'));

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(pokemon =>  pokemon.id === id);
    const message = 'Un pokémon a bien été trouvé.';
    res.json(success(message, pokemon));
});

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons);
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated);
    const message = `Le pokemon ${pokemonCreated.name} a bien été créé`;
    res.json(success(message, pokemonCreated))
});

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id: id};
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokémon ${pokemonUpdated} a bien été modifié.`;
    res.json(success(message, pokemonUpdated));
});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id);
    pokemons.filter(pokemon => pokemon.id != id)
    const message = `Le pokémon ${pokemonDeleted} a bien été supprimé.`;
    res.json(success(message, pokemonDeleted));
});

app.get('/api/pokemons', (req, res) => {
    const message = 'Voici la liste complète de tout les pokémons';
    res.json(success(message, pokemons));
});

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`));
