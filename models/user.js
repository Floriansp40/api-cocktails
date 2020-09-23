/****************************************/
/*** Chargement des modules nécessaires */
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/*******************************/
/*** Définition du modèle User */
const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING
    },
    prenom: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
})


module.exports = User