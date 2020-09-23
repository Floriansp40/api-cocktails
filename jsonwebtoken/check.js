/****************************************/
/*** Chargement des modules nécessaires */
const jwt = require('jsonwebtoken')

/***************************************************/
/*** Récupération du header et découpage du bearer */
const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    // On isole le mot clef bearer et le token
    const matches = headerValue.match(/(bearer)\s+(\S+)/i)

    return matches && matches[2]
}

/******************************************/
/*** Vérification de la présence du token */
const checkTokenMiddleware = (req, res, next) => {
    // Récupération du token
    const token = req.headers.authorization && extractBearerToken(req.headers.authorization)

    // Si il n'y a aucun token dans l'entête
    if (!token) {
        res.status(401).json({ message: 'Error. Need a token' })
    }

    // Vérification de la validité du token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ message: 'Error. Bad token' })
        } else {
            console.log('tout va bien')
            next()
        }
    })
}

module.exports = checkTokenMiddleware
