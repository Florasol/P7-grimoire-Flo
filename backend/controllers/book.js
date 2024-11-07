const Book = require('../models/book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find().then(
    (books) => {
        res.status(200).json(books);
        console.log('Liste de livre telechargee');
        console.log(books.length);
    }
    ).catch(
    (error) => {
        res.status(400).json({
        error: error
        });
    }
    );
};

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
    _id: req.params.id // req.params.id est le paramètre id dans l'URL
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


  exports.rateBook = (req, res, next) => {
    console.log("rateBook controller called");
    const ratingObject = {    // Stockage de la requête dans une constante
        userId : `${req.body.userId}`,
        grade : req.body.rating
      } 
    
    if (req.body.rating >= 0 && req.body.rating <= 5) { // Vérification que la note est dans les limites autorisées
        console.log("Rating is valid:", req.body.rating);

        Book.findOne({ _id: req.params.id }) // Recherche du livre auquel on veut ajouter une note
            .then(book => {
                console.log("Book found:", book);

                // Récupération des notes existantes et des userIds
                const newRatings = book.ratings;
                const userIdArray = newRatings.map(rating => rating.userId);

                // Vérification si l'utilisateur a déjà noté ce livre
                if (userIdArray.includes(req.auth.userId)) {
                    console.log("User has already rated this book.");
                    return res.status(403).json({ message: 'Not authorized' });
                } else {
                    // Ajout de la nouvelle note
                    newRatings.push(ratingObject);
                    console.log("New ratings array:", newRatings);

                    // Calcul de la moyenne des notes
                    const grades = newRatings.map(rating => rating.grade);
                    const averageGrades = Math.round(grades.reduce((acc, grade) => acc + grade, 0) / grades.length);
                    console.log("Average grade calculated:", averageGrades);  // Affichage de la moyenne calculée

                    // Mise à jour du livre avec les nouvelles notes et la nouvelle moyenne
                    Book.findOneAndUpdate(
                        { _id: req.params.id },
                        { $push: { ratings: ratingObject }, $set: { averageRating: averageGrades } },
                        { new: true } // S'assure de retourner le livre à jour
                    )
                        .then(updatedBook => {
                            res.status(200).json(updatedBook); // Return the updated book data
                        })
                        .catch(error => {
                            console.log("Error updating book:", error); // Log d'erreur si échec de la mise à jour
                            res.status(400).json({ error: 'Erreur lors de l\'actualisation', details: error });
                        });
                }
            })
            .catch(error => {
                console.log("Error finding book:", error); // Log d'erreur si échec de la recherche du livre
                res.status(404).json({ error });
            });
    } else {
        console.log("Invalid rating received:", req.body.rating); // Log si la note n'est pas valide
        res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
    }
};

exports.getBestRatedBooks = (req, res, next) => {
    Book.find({ averageRating: { $exists: true } }) // Ensure only books with averageRating are considered
    .sort({ averageRating: -1 })
    .limit(3)
    .then(topRatedBooks => {
        if (!topRatedBooks.length) {
            res.status(404).json({ message: 'No books found' }); // Handling the case with no results
        } else {
            res.status(200).json(topRatedBooks);
        }
    })
    .catch(error => {
        console.error('Error fetching top-rated books:', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des livres les mieux notés.' });
    });
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
