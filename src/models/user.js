module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: {
                msg: `Le nom est déjà pris.`
            }
        },
        password: {
            type: DataTypes.STRING
        }
    });

    User.associate = function(models){
        User.hasMany(models.Pokemon, {
            foreignKey: 'userId',
            as: 'pokemons'
        })
    };

    return User;
}
  