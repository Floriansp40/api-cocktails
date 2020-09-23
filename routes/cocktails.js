/****************************************/
/*** Chargement des modules nécessaires */
const express = require('express')

/***********************************/
/*** Chargement du modèle Cocktail */
const Cocktail = require('../models/cocktail')

/**************************************/
/*** Récupération du Router d'Express */
var router = express.Router()

/********************************************************/
/*** Un middleware pour logger la date sur les requêtes */
router.use(function timeLog(req, res, next){
    const event = new Date()
    console.log('COCKTAIL Time :', event.toString())
    next()
})

/**************************************/
/*** Routage de la ressource Cocktail */
router.get('/index', (req, res) => {
    Cocktail.findAll()
        .then(cocktails => {
            return res.json({ data:cocktails })
        })
        .catch(err => res.json({ message: 'Database error', error: err}))    
})

router.post('/add', (req, res) => {
    // Vérification si on a tous les champs
    if(!req.body.nom || !req.body.description){
        return res.status(400).json({ message: 'Il manque une informations'})
    }

    // Vérification si un cocktail porte déjà ce nom
    Cocktail.findOne({ where: {nom: req.body.nom }, raw: true})
        .then(cocktail => {
            // Vérification si le cocktail existe déjà
            if(cocktail !== null){
                return res.status(400).json({ message: 'Ce cocktail existe déjà'})
            }

            // Tout va bien on ajoute le cocktail
            Cocktail.create(req.body)
                .then(cocktail => res.json({ message: 'Cocktail created', cocktail: cocktail}))
                .catch(err => res.json({ message: 'Database error', error: err}))
        })
        .catch(err => res.json({ message: 'Database error', error: err}))
})

router.put('/edit', (req, res) => {
    // Vérification si le champ id est présent
    if(!req.body.id){
        return res.status(400).json({ message: 'Information manquante'})
    }

    // Mise à jour du cocktail
    Cocktail.update(req.body, {
        where: {id: req.body.id}
    })
    .then(cocktail => res.json({ message: 'Cocktail updated', cocktail: cocktail}))
    .catch(err => res.json({ message: 'Databse error', error: err}))    
})

router.delete('/delete/:cocktail_id', (req, res) => {
    Cocktail.destroy({ where: { id: req.params.cocktail_id }})
        .then(() => res.json({ message: 'Cocktail deleted'}))
        .catch(err => res.json({ message: 'Database error', error: err}))    
})

module.exports = router