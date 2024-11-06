const bcrypt = require('bcrypt');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10) // fonction qui crypte le mdp (10 fois exécution algo de hachage)
      .then(hash => {
        const user = new User({ //crée un nouveau User avec le mdp crypté
          email: req.body.email,
          password: hash
        });
        user.save() // Save the new user to the database
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Success message
          .catch(error => res.status(400).json({ error })); // Error saving the user
      })
      .catch(error => res.status(500).json({ error }));
  };


  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); //erreur d'identification
                    } else {
                    res.status(200).json({ // infos nécessaires à l'authentification des requêtes émises par la suite par l'utilisateur
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, //payload= ID de l'utilisateur encodées dans le token
                            'RANDOM_TOKEN_SECRET', //chaîne secrète temporaire
                            { expiresIn: '24h' }
                        )
                    });
                }
                })
                .catch(error => res.status(500).json({ error })); // erreur de traitement
        })
        .catch(error => res.status(500).json({ error }));
 };