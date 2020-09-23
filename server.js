/****************************************/
/*** Chargement des modules nécessaires */
const express = require('express')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const cors = require('cors')

/***************************************/
/*** Chargement des modules de routage */
var auth_router = require('./routes/auth')
var user_router = require('./routes/user')
var cocktails_router = require('./routes/cocktails')
var newsletter_router = require('./routes/newsletter')

/*****************************************************/
/*** Chargement de la connexion à la base de données */
var db = require('./db.config')

/**************************************************/
/*** Initialisation du serveur et des middlewares */
const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

/**********************************************************/
/*** Mise en place du routage avec les différents modules */
app.get('/', (req, res) => {
    return res.send(`I'm online, weldone !`)
})

app.use('/auth', auth_router)
app.use('/user', user_router)
app.use('/cocktail', cocktails_router)
app.use('/newsletter', newsletter_router)

// ici notre route par défaut - la 404
app.get('*', (req, res) => {
    return res.status(404).send('What the hell are you doing !?!')
})

/**************************************************/
/*** Démarrage du serveur avec test BDD préalable */
db.authenticate()
    .then(() => {
        console.log("Database connection OK")
    })
    .then(() => {
        // BDD Ok on démarre le serveur
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`The server is running on port ${process.env.SERVER_PORT}. Have fun !`)
        })
    })
    .catch(err => {
        console.log('Databse error : ', err)
    })

