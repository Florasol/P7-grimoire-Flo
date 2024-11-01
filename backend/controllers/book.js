const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // résoudre l'url complète de l'image
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};
  
exports.getOneBook = (req, res, next) => {
    Book.findOne({
    _id: req.params.id
    }).then(
    (book) => {
        res.status(200).json(book);
    }
    ).catch(
    (error) => {
        res.status(404).json({
        error: error
        });
    }
    );
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId; // mesure de sécurité pour que l'utilisateur ne prenne pas le même iD
  Book.findOne({_id: req.params.id}) // faire le lien entre l'utilisateur et son objet pour vérifier
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Non-autorisé'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id}) // si c'est le bon utilisateur, on met à jour l'enregistrement
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id}) 
      .then(book => {
          if (book.userId != req.auth.userId) { // vérifier que ce soit le propriétaire qui demande la suppression
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1]; // on supprime l'objet mais aussi l'image
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})            // méthode appelée de manière asynchrone, on supprime le fichier de la base de données
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllBooks = (req, res, next) => {
    Book.find().then(
    (books) => {
        res.status(200).json(books);
    }
    ).catch(
    (error) => {
        res.status(400).json({
        error: error
        });
    }
    );
};