/****************************************/
/*** Chargement des modules nécessaires */
const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')

/**************************************************/
/*** Initialisation du serveur et des middlewares */
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

/***************************************/
/*** Chargement des modules de routage */
var auth_router = require('./routes/auth')
var user_router = require('./routes/user')
var cocktails_router = require('./routes/cocktails')

/*****************************************************/
/*** Chargement de la connexion à la base de données */
var bdd = require('./db.config')

/**********************************************************/
/*** Mise en place du routage avec les différents modules */
app.get('/', (req, res) => {
    return res.send(`I'm online. Weldone !`)
})

app.use('/auth', auth_router)
app.use('/users', user_router)
app.use('/cocktails', cocktails_router)

// ici notre route par défaut - la 501
app.get('*', (req, res) => {
    return res.status(501).send(`What the hell are you doing !?!`)
})

/**************************************************/
/*** Démarrage du serveur avec test BDD préalable */
bdd.authenticate()
    .then(() => console.log(`Database connection OK`))
    .then(() => {
        // BDD Ok on démarre le serveur
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`The server is running on port ${process.env.SERVER_PORT}. Have fun !`)
        })
    })
    .catch(err => console.log(`Database Error :  `, err))

