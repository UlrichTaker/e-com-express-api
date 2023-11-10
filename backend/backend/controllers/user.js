const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {//Cette ligne exporte la fonction signup pour pouvoir l'utiliser dans d'autres parties de l'application. La fonction est un gestionnaire de route qui gère les demandes d'inscription d'un nouvel utilisateur.
    //Le mot de passe fourni par l'utilisateur (dans req.body.password) est haché de manière sécurisée à l'aide de la fonction bcrypt.hash. Le "sel" pour le hachage est défini sur 10.
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        //Un nouvel objet utilisateur est créé en utilisant le modèle "User". Cet objet utilisateur comprend l'adresse e-mail (req.body.email) fournie par l'utilisateur et le hachage sécurisé du mot de passe (hash).
        const user = new User({
          email: req.body.email,
          password: hash
        });
        //L'objet utilisateur est enregistré dans la base de données à l'aide de user.save()
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      //Si une erreur survient lors du hachage du mot de passe ou pour d'autres raisons, une réponse avec un code de statut 500 est renvoyée, indiquant une erreur interne du serveur.
      .catch(error => res.status(500).json({ error }));
  };

  //Cette ligne exporte la fonction login pour pouvoir l'utiliser dans d'autres parties de l'application. La fonction est un gestionnaire de route qui gère les demandes de connexion d'un utilisateur existant.
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })//L'application recherche un utilisateur dans la base de données qui correspond à l'adresse e-mail fournie (req.body.email) à l'aide de User.findOne(). 
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});//Si aucun utilisateur n'est trouvé, le gestionnaire de route renvoie une réponse avec un code de statut 401 indiquant une "paire login/mot de passe incorrecte".
            }
            bcrypt.compare(req.body.password, user.password)//Si un utilisateur est trouvé, l'application vérifie la validité du mot de passe fourni en comparant le hachage du mot de passe stocké avec le mot de passe fourni à l'aide de bcrypt.compare(). Si la comparaison n'est pas valide, le gestionnaire de route renvoie une réponse avec un code de statut 401, indiquant une "paire login/mot de passe incorrecte".
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    //Si la comparaison est valide, c'est-à-dire que le mot de passe fourni correspond au hachage stocké, le gestionnaire de route renvoie une réponse avec un code de statut 200. Il inclut également l'ID de l'utilisateur (userId) et un "jeton" (token). Le jeton est généralement utilisé pour l'authentification ultérieure de l'utilisateur.
                    res.status(200).json({
                        userId: user._id,
                        //Token d'authentification
                        token: jwt.sign(//•	Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
                            { userId: user._id },//Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
                            'RANDOM_TOKEN_SECRET',//•	Nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour crypter notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production). Puisque cette chaîne sert de clé pour le chiffrement et le déchiffrement du token, elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur.
                            { expiresIn: '24h' }//•	Nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
                        ) 
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
   