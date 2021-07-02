/****************************************/
/*** Chargement des modules nécessaires */
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/*******************************/
/*** Définition du modèle User */
const Cocktail = db.define('Cocktail', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        unique:true
    },
    description: {
        type: DataTypes.TEXT
    }
})

module.exports = Cocktail