const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // on récupère et split le header - divise la chaine de caractères en un tableau
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // méthode verify avec le token et la clé secrète
       const userId = decodedToken.userId; //on récupère la propriété userId du token décodé
       
       // Vérification supplémentaire de l'expiration
       const isExpired = decodedToken.exp * 1000 < Date.now();
       if (isExpired) {
           return res.status(401).json({ message: 'Session expirée. Veuillez vous reconnecter.' });
       }
       
       req.auth = { 
           userId: userId // objet transmis aux routes qui vont être appelées
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};