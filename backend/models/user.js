const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //infos stockées, impossible de s'inscrire plusieurs fois avec la mm adresse
  password: { type: String, required: true }             //le mot de passe est un hash mais aussi un string
});

userSchema.plugin(uniqueValidator); // gestion plus fine et fiable des duplicatas, fournit messages personnalisés

module.exports = mongoose.model('User', userSchema);