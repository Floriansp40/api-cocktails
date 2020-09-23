# API Cocktail

[![N|Solid](https://greta-cfa-aquitaine.fr/themes/parker-theme/images/logo.png)](https://greta-cfa-aquitaine.fr/)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Il s'agit de l'API en Express pour l'exercice Angular-Ionic-API de la formation Javascript du Greta-CFA Aquitaine

# Installation

Api-Cocktail utilise Node.js .

```sh
$ npm install
```

### Plugins

Api-Cocktail utilise les plugins/modules suivants

| Plugin |  |
| ------ | ------ |
| Express | Le serveur |
| Dotenv | Les variables d'environnement |
| Jsonwebtoken | Le JWT |
| Sequelize | L'ORM |
| Mysql2 | Dialect pour l'ORM |
| BCrypt | Hashage mot de passe |
| Morgan | Système log |
| Nodemon | Pas besoin d'expliquer ;) |

# Avant tout
Penser à renomer le fichier .env.exemple en .env et d'y mettre ses propres paramètres

# Pré-requis
Une base de donnée Mysql/MariaDb

# Lancement du serveur
```sh
$ npm run dev
/
$ npm run start
```
# Procédure de réécriture
Attention dans un dossier à part bien sûr ;)

## Le serveur en lui-même
Alors tout d'abord il nous devons initialiser le projet avec une simple
```sh
$ npm init -y
```
Vous vous retrouvez avec un fichier package.json
Dans ce fichier nous allons déjà rajouter un script afin de nous facilitter la vie `"starts": "nodemon -r dotenv/config server.js`

Une fois cela fait on va donc créer notre fichier `server.js`

La structure de ce dernier est somme toute simple
  - On charge les modules dont nous avons besoin
  - On prépare les "zones" pour les autres modules - à faire après
  - On paramètre des routes classique et surtout la route 404
  - On démarre le serveur

Voilà en reprenant ce qui est fait dans le fichier du dépot vous devriez avoir une bonne base de démarrage.
Et au lancement du serveur tout devrait être SANS erreur dans le terminal
----
License
MIT