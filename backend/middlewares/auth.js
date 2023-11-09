const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {//Le middleware est exporté sous forme de fonction prenant trois arguments : req (requête), res (réponse) et next (une fonction à appeler pour passer au middleware suivant).
   try {
        //Nous extrayons le token du header Authorization de la requête entrante.N'oubliez pas qu'il contiendra également le mot-clé Bearer. Nous utilisons donc la fonction split pour tout récupérer après l'espace dans le header. Les erreurs générées ici s'afficheront dans le bloc catch. 
       const token = req.headers.authorization.split(' ')[1];//split(' ') est utilisé pour diviser le header et récupérer la partie après l'espace. Toute erreur liée à cette opération sera capturée dans le bloc catch.
       //•	Nous utilisons ensuite la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée.
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       //•	Nous extrayons l'ID utilisateur de notre token et le rajoutons à l’objet Request afin que nos différentes routes puissent l’exploiter.
       const userId = decodedToken.userId;//Si le token est valide et décodé avec succès, l'ID de l'utilisateur est extrait du token et stocké dans une variable userId.
       req.auth = {//L'objet req.auth est ensuite créé, contenant l'ID de l'utilisateur, de manière à rendre cette information accessible aux autres middlewares ou aux routes ultérieures.
           userId: userId
       };
       //•	Dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons à l'exécution à l'aide de la fonction next().
    next();
   } catch(error) {
       res.status(401).json({ error });
   }
};
