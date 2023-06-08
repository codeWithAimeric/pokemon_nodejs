const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée'];

module.exports = (sequelize, DataTypes) => {
    const Pokemon = sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: `Le nom est déjà pris.`
        },
        validate: {
          notEmpty: { msg: `La valeur du nom ne doit pas être vide.` },
          notNull: { msg: `Le champ name ne doit pas être vide.`},
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        validate: {
          isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de vie.` },
          notNull: { msg: `Les points de vie sont une propriété requise.` },
          min: {
            args: [0],
            msg: `Cette valeur ne peut être égale à 0.`
          },
          max: {
            args: [999],
            msg: `Cette valeur est trop élevée.`
          } 
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: `Utilisez uniquement des nombres entiers pour cp` },
          notNull: { msg: `cp est une propriété requise.` },
          min: {
            args: [0],
            msg: `Cette valeur ne peut être égale à 0.`
          },
          max: {
            args: [99], 
            msg: `Cette valeur est trop élevée.`
          } 
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
          isUrl: { msg: `Utilisez uniquement des urls pour les images` },
          notNull: { msg: `picture est une propriété requise.` }
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get(){
            return this.getDataValue('types').split(',') 
        },
        set(types){
            this.setDataValue('types', types.join())
        },
        validate: {
          isTypesValid(value){
            if(!value){
              throw new Error(`Un pokémon doit au moins avoir un type.`)
            }
            if(value.split(',').length > 3){
              throw new Error(`Un pokémon ne peut avoir plus de trois types.`)
            }
            value.split(',').forEach(element => {
              if(!validTypes.includes(element)){
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante: ${validTypes}`)
              }
            });
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    });

    Pokemon.associate = function(models){
      Pokemon.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    };

    return Pokemon;
}
//'define' prends 3 params : _le nom du modèle, _la description du modèle(colonnes), _option de parametrage globale(createdAt et updatedAt : générés automatiquement)
//Synchroniser le modèle avec la BD : 

