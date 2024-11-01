const multer = require('multer');

const MIME_TYPES = { // dictionnaire qui traduit les extensions
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // configure le chemin et le nom de fichier pour les fichiers entrants
  destination: (req, file, callback) => { 
    callback(null, 'images'); // callback permet de gérer les tâches en différé. Null = pas d'erreur, puis le dossier de destination
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // on remplace les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension); // on crée le filename entier avec un timestamp
  }
});

module.exports = multer({storage: storage}).single('image'); // single capture les fichiers de type image et les enregistre au système de fichiers du serveur