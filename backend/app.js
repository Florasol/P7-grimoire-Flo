const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Importation des routeurs
const bookRoutes = require('./routes/book'); 
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://floralusoler:RjVIcpqHvLqP8tCd@clusteroc.o6o5d.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOC')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    console.log('Headers de contrôles d accès ok !');
    next();
  });

app.use(bodyParser.json()); // Rend les données du corps de la requête exploitables

app.use('/images', express.static(path.join(__dirname, 'images'))); // on indique à express de gérer la ressource images de manière statique
app.use('/api/books', bookRoutes); //la logique est importée grâce à bookRoutes et appliquée à la route
app.use('/api/auth', userRoutes);

module.exports = app;