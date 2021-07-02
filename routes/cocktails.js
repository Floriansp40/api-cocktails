/****************************************/
/*** Chargement des modules nécessaires */
const express = require('express')
const checkTokenMiddleware = require('../jsonwebtoken/check')

/***********************************/
/*** Chargement du modèle Cocktail */
const Cocktail = require('../models/cocktail')

/**************************************/
/*** Récupération du Router d'Express */
var router = express.Router()

/********************************************************/
/*** Un middleware pour logger la date sur les requêtes */
router.use(function timeLog(req, res, next) {
    const event = new Date()
    console.log('COCKTAIL Time :', event.toString())
    next()
})

/**************************************/
/*** Routage de la ressource Cocktail */
router.get('', (req, res) => {
    Cocktail.findAll()
        .then(cocktails => res.json({ data: cocktails }))
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

router.put('', checkTokenMiddleware, (req, res) => {
    const { nom, description } = req.body

    // Vérification des données reçues
    if (!nom || !description) {
        return res.status(400).json({ message: `Missing Data` })
    }

    Cocktail.findOne({ where: { nom: nom }, raw: true })
        .then(cocktail => {
            // Vérification si le cocktail existe déjà
            if (cocktail !== null) {
                return res.status(409).json({ message: `The cocktail ${nom} already exists !` })
            }

            // Tout va bien on ajoute le cocktail
            Cocktail.create(req.body)
                .then(cocktail => res.json({ message: `Cocktail ${nom} created`, cocktail: cocktail }))
                .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
        })
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

router.patch('/:id', checkTokenMiddleware, (req, res) => {
    let cocktailId = perseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    // Vérification si le cocktail existe bien
    Cocktail.findOne({ where: { id: cocktailId }, raw: true })
        .then(cocktail => {
            if (cocktail === null) {
                return res.status(404).json({ message: `This cocktail does not exist` })
            }

            // Mise à jour du cocktail
            Cocktail.update(req.body, { where: { id: cocktailId } })
                .then(cocktail => res.json({ message: `Cocktail Updated`, cocktail: cocktail }))
                .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
        })
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

router.delete('/:id', checkTokenMiddleware, (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.status(400).json({ message: `Missing Parameter` })
    }

    Cocktail.destroy({ where: { id: cocktailId } })
        .then(() => res.status(204).json({ message: `Cocktail Deleted` }))
        .catch(err => res.status(500).json({ message: `Database Error`, error: err }))
})

module.exports = router