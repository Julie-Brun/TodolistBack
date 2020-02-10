// Déclarations des dépendances

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// Initialisation de la connexion a la base de données
mongoose.connect('mongodb://localhost/todoList', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Récuperation des models
// let User = require('./models/user');

// Déclarations des routes de notre application
app.route('/').get(function(req, res) {
    res.send('hello world !');
});


// Mise en écoute de notre application (sur le port 3000)
app.listen(3000);
