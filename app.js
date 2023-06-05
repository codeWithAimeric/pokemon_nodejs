const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize');

const app = express();
const port = process.env.PORT || 3000;

//middleware
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

sequelize.initDb();

app.get('/', (req, res) => {
    res.json(`Hello World ! `)
});

require('./src/routes/pokemon/findAllPokemons')(app)
require('./src/routes/pokemon/findPokemonByPk')(app)
require('./src/routes/pokemon/createPokemon')(app)
require('./src/routes/pokemon/updatePokemon')(app)
require('./src/routes/pokemon/deletePokemon')(app)

require('./src/routes/user/login')(app)
require('./src/routes/user/create')(app)
require('./src/routes/user/update')(app)
require('./src/routes/user/delete')(app)
require('./src/routes/user/findUserByPk')(app)
require('./src/routes/user/findAllUser')(app)

//gestion des erreurs 404
app.use(({res}) => {
    const message = `Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.`;
    res.status(404).json({message});
});

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`));
