const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks); //on n'appelle pas la (fonction), on l'applique à la route
router.get('/bestrating', bookCtrl.getBestRatedBooks); // la route bestrating doit être avant :id sinon elle sera interceptée comme un id. 
router.get('/:id', bookCtrl.getOneBook); // /:id correspond à toute chaîne suivant /api/books/
router.post('/', auth, multer, bookCtrl.createBook); // placer multer après la requête d'identification
router.post('/:id/rating', auth, multer, bookCtrl.rateBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);


module.exports = router;