const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Book = require('./models/book');

const app = express();

mongoose.connect('mongodb+srv://floralusoler:<db_password>@clusteroc.o6o5d.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOC',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); // Intercepte toutes les requêtes qui ont du contenu JSON

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    console.log('Headers de contrôles d accès ok !');
    next();
  });

  app.post('/api/books', (req, res, next) => {
    delete req.body._id; // on supprime le faux id envoyé par le front-end
    const book = new Book({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

app.get('/api/books',(req, res) => {
  fs.readFile(path.join(__dirname, '../frontend/public/data/data.json'), 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading the data file', err);
          res.status(500).json({ message: 'Server error' });
          return;
      }
      const books = JSON.parse(data);
      res.status(200).json(books);
  });
});

module.exports = app;