/****************************************/
/*** Chargement des modules nécessaires */
const express = require('express')

/*************************************/
/*** Chargement du modèle Newsletter */
const Newsletter = require('../models/newsletter')

/**************************************/
/*** Récupération du Router d'Express */
var router = express.Router()

/********************************************************/
/*** Un middleware pour logger la date sur les requêtes */
router.use(function timeLog(req, res, next){
    const event = new Date()
    console.log('NEWSLETTER Time :', event.toString())
    next()
})

/**********************************/
/*** Routage de la ressource Newsletter */
router.get('/index', (req, res) => {
    Newsletter.findAll()
        .then((newsletters) => {
            return res.json({ data: newsletters })
        })
        .catch(err => res.json({ message: 'Database error', error: err}))    
})

router.delete('/delete/:newsletter_id', (req, res) => {
    Newsletter.destroy({ where: {id: req.params.newsletter_id }})
        .then(() => {
            return res.json({ message: 'Inscription supprimée'})
        })
        .catch(err => res.json({ message: 'Database error', error: err}))    
})

module.exports = router