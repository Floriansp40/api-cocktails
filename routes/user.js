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
router.use(function timeLog(req, res, next){
    const event = new Date()
    console.log('USER Time :', event.toString())
    next()
})

/**********************************/
/*** Routage de la ressource User */
router.get('/index', checkTokenMiddleware, (req, res) => {
    User.findAll()
        .then(users => {
            return res.json({ data: users})
        })
        .catch(err => res.json({ message: 'Database error', error: err}))
    
})

router.post('/add', (req, res) => {
    const {nom, prenom, username, password} = req.body

    // Vérification des données en reçues
    if(!nom || !prenom || !username || !password){
        return res.status(400).json({ message: 'Il manque un paramètre'})
    }

    // Verification si l'utilisateur existe déjà
    User.findOne({ where: { username: username }, raw: true })
        .then(user => {
            if(user !== null){
                return res.status(400).json({ message: 'Ce compte existe déjà !'})
            }

            // Hashage du mot de passe
            bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
            .then(hash => {
                // On a reçu le mot de passe hashé on peut enregistrer le nouveau compte
                req.body.password = hash

                User.create(req.body)
                .then(user => res.json({ message: 'User created', user: user}))
                .catch(err => res.json({ message: 'Database error', error: err}))
            })
            .catch(err => res.json({ message: 'Password hash error', error: err }))
            
        })        
        .catch(err => res.json({ message: 'Database error', error: err}))
})

router.put('/edit', (req, res) => {
    // Vérifier si le champ id est présent
    if(!req.body.id){
        return res.status(400).json({ message: 'Informations manquantes'})
    }

    // Vérifier si il existe dans la table user
    User.findOne({ where: { id: req.body.id }, raw: true})
        .then(user => {
            if(user === null){
                return res.status(400).json({ message: 'Utilisateur introuvable'})
            }

            User.update(req.body, {
                where: { id: req.body.id}
              })
              .then(user => res.json({ message: 'User updated', data: user}))
              .catch(err => res.json({ message: 'Database error', error: err}))
        })
        .catch(err => res.json({ message: 'Database error', error: err}))
})

router.delete('/delete/:user_id', (req, res) => {
    User.destroy({ where: { id: req.params.user_id } })
        .then(() => {
            return res.json({ message: 'User deleted'})
        })
        .catch(err => res.json({ message: 'Database error', error: err}))
})

module.exports = router