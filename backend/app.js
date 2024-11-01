const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Book = require('./models/book');

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

// Route POST
app.post('/api/books', (req, res, next) => {
  delete req.body._id;  // on supprime le faux id envoyé par le front-end
  const book = new Book({
    ...req.body         // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
  });
  book.save()           // enregistre new Book dans la base de données
    .then(() => res.status(201).json({ message: 'Livre enregistré !'})) // on envoie une réponse, sinon la requête expire
    .catch(error => res.status(400).json({ error }));
});

// Route GET individuelle
app.get('/api/books/:id', (req, res, next) => {     
  Book.findOne({ _id: req.params.id })                  // paramètre de route dynamique
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

// Route PUT 
app.put('/api/books/:id', (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

// Route DELETE
app.delete('/api/books/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

// Route GET 
app.get('/api/books',(req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;