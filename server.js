// Déclarations des dépendances

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// Initialisation de la connexion a la base de données
mongoose.connect('mongodb://localhost/todoList', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Récuperation des models
let User = require('./models/user');
let List = require('./models/list');
let Task = require('./models/task');

// Déclarations des routes de notre application
app.route('/').get(function(req, res) {
    res.send('hello world !');
});

// Route Users
app.route('/users').get(function(req, res){
    User.find({}, function(err, data) {
        res.send(data);
    });
});

// Route Register
app.route('/register').post(function(req, res) {
    bcrypt.hash(req.body.password, 10, function(err, hash){
        let user = new User({
            name : req.body.name,
            email : req.body.email,
            password : hash,
        });
    
        user.save(function(err, data) {
            if (err)
                res.send(err);
            else {
                res.send(data);
            };
        });
    });
});

// Route Login
app.route('/login').post(function(req, res) {
    User.findOne({email : req.body.email}, function(err, data) {
        if (data) {
            bcrypt.compare(req.body.password, data.password, function(err, result) {
                if (result) {
                    let token = jwt.sign({id: data._id}, "maclefsecrete");
                    let response = {user: data, token: token}
                    res.send(response);
                } else
                    res.send('error : ' + err);
            });
        } else {
            res.send(err);
        }
    });
});

// Route Appeler User en fonction de l'ID
app.route('/user/:id').get(function(req, res) {
    // User.findOne({_id: req.params.id}, function(err, data){
    //     if (err)
    //         res.send(err);
    //     else
    //         res.send(data);
    // });
    User.findOne({_id: req.params.id}).populate('listID[]').exec(function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);        
    });
});

// Route Update User
app.route('/updateuser').put(function(req, res){
    User.updateOne({_id: req.body.id}, { $set: {listID: req.body['listID[]']} }, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});

// Route Supprimer User
app.route('/deleteuser').delete(function(req, res) {
    User.deleteOne({_id: req.body.id}, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});

// Route Listes
app.route('/list').get(function(req, res){
    List.find({}, function(err, data) {
        res.send(data);
    });
});

// Route Ajouter Liste
app.route('/addlist').post(function(req, res) {
    jwt.verify(req.headers["x-access-token"], "maclefsecrete", function(err, decoded) {
        if (err)
            res.send(err)
        else {
            let list = new List({
                userID : [decoded.id],
                name : req.body.name
            });
        
            list.save(function(err, data) {
                console.log(err);
                if (err)
                    res.send(err);
                else {
                    res.send(data);
                };
            });
        }
    });        
});

// Route Appeler Liste en fonction de l'ID
app.route('/list/:id').get(function(req, res) {
    List.findOne({_id: req.params.id}).populate('userID').exec(function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);        
    });
});

// Route Update Liste
app.route('/updatelist').put(function(req, res) {
    List.updateOne({_id: req.body.id}, { $set: {name : req.body} }, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});

// Route Supprimer Liste
app.route('/deletelist').delete(function(req, res) {
    List.deleteOne({_id: req.body.id}, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});

// Route Tâche
app.route('/task').get(function(req, res) {
    Task.find({}, function(err, data) {
        res.send(data);
    });
});

// Route Ajouter Tâche
app.route('/addtask').post(function(req, res) {
    console.log(req.body);
    
    let task = new Task({
        listID : req.body['listID[]'],
        name : req.body.name
    });

    task.save(function(err, data) {
        console.log(err);
        if (err)
            res.send(err);
        else {
            res.send(data);
        };
    });    
});

// Route Appeler Tâche en fonction de l'ID
app.route('/task/:id').get(function(req, res) {
    Task.findOne({_id: req.params.id}).populate('listID').exec(function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);        
    });
});

// Route Update Tâche
app.route('/updatetask').put(function(req, res) {
    Task.updateOne({_id: req.body.id}, { $set: {listID: req.body.listID} }, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});

// Route Supprimer Tâche
app.route('/deletetask').delete(function(req, res) {
    Task.deleteOne({_id: req.body.id}, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(data);
    });
});



// Mise en écoute de notre application (sur le port 3000)
app.listen(3000);
