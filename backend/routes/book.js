const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/book');

router.get('/', auth, bookCtrl.getAllBooks); //on n'appelle pas la (fonction), on l'applique à la route
router.post('/', auth, multer, bookCtrl.createBook); // placer multer après la requête d'identification
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;