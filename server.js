/****************************************/
/*** Chargement des modules nécessaires */
const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

/**************************************************/
/*** Initialisation du serveur et des middlewares */
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/***************************************/
/*** Chargement des modules de routage */
let auth_router = require('./routes/auth')
let user_router = require('./routes/user')
let cocktails_router = require('./routes/cocktails')

/*****************************************************/
/*** Chargement de la connexion à la base de données */
let bdd = require('./db.config')

/**************************************************/
/*** Mise en place de la documentation Swagger UI */
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.2.1",
            title: "Cocktail API",
            description: "Cocktail API Information",
            contact: {
                name: "Florian"
            },
            servers: ["http://localhost:8989"]
        }
    },
    // ['.routes/*.js']
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

