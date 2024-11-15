const multer = require('multer');

const MIME_TYPES = { // dictionnaire qui traduit les extensions
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

let fileCounter = 0; // Initialisation du compteur

const storage = multer.diskStorage({ // configure le chemin et le nom de fichier pour les fichiers entrants
  destination: (req, file, callback) => { 
    callback(null, 'images'); // callback permet de gérer les tâches en différé. Null = pas d'erreur, puis le dossier de destination
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    fileCounter++; // Incrémente le compteur
    const date = new Date().toISOString().split('T')[0];
    callback(null, `book_cover_${fileCounter}_${date}.${extension}`); // on crée le filename entier avec un timestamp une fois qu'il est défini sur le serveur
  }
});

module.exports = multer({storage}).single('image'); // single capture les fichiers de type image et les enregistre au système de fichiers du serveur