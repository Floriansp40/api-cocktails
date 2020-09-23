/****************************************/
/*** Chargement des modules nécessaires */
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/*************************************/
/*** Définition du modèle Newsletter */
const Newsletter = db.define('Newsletter', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING
    }
})

module.exports = Newsletter