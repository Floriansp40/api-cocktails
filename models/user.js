/****************************************/
/*** Chargement des modules nécessaires */
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/*******************************/
/*** Définition du modèle User */
const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(64),
        is: /^[0-9a-f]{64}$/i // Ici une contrainte
    }
})


module.exports = User