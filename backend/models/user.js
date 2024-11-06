const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //infos stockées
  password: { type: String, required: true }             //le mot de passe est un hash mais aussi un string
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);