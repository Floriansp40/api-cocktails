/****************************************/
/*** Chargement des modules nécessaires */
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const checkTokenMiddleware = require('../jsonwebtoken/check')

/*******************************/
/*** Chargement du modèle User */
const User = require('../models/user')

/**************************************/
/*** Récupération du Router d'Express */
var router = express.Router()

/********************************************************/
/*** Un middleware pour logger la date sur les requêtes */
router.use(function timeLog(req, res, next) {
    const event = new Date()
    console.log('USER Time :', event.toString())
    next()

    //req.header.url
})

/**********************************/
/*** Routage de la ressource User */
router.get('', checkTokenMiddleware, (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

router.put('', checkTokenMiddleware, (req, res) => {
    const { nom, prenom, username, password } = req.body

    // Vérification des données en reçues
    if (!nom || !prenom || !username || !password) {
        return res.status(400).json({ message: `Missing Data` })
    }

    User.findOne({ where: { username: username }, raw: true })
        .then(user => {
            // Vérification si l'utilisateur existe déjà
            if (user !== null) {
                return res.status(409).json({ message: `The user ${nom} already exists !` })
            }

            // Hashage du mot de passe
            bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    // On a reçu le mot de passe hashé on peut enregistrer le nouveau compte
                    req.body.password = hash

                    User.create(req.body)
                        .then(user => res.json({ message: `User ${nom} Created !`, user: user }))
                        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
                })
                .catch(err => res.status(500).json({ message: `Password Hash Process Error`, error: err }))

        })
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

router.patch('/:id', checkTokenMiddleware, (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérifier si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    // Vérifier si l'utilisateur existe bien
    User.findOne({ where: { id: userId }, raw: true })
        .then(user => {
            if (user === null) {
                return res.status(404).json({ message: `This user does not exist` })
            }

            // Mise à jour de l'utilisateur
            User.update(req.body, { where: { id: userId } })
                .then(user => res.json({ message: `User Updated`, data: user }))
                .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
        })
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

router.delete('/:id', checkTokenMiddleware, (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérifier si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    User.destroy({ where: { id: userId } })
        .then(() => res.status(204).json({ message: `User Deleted` }))
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

module.exports = router