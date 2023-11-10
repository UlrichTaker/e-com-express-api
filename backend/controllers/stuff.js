const Thing = require('../models/thing');
const fs = require('fs');//fs  signifie « file system » (soit « système de fichiers », en français). Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);//extraire l'objet "thing" du corps de la requête. Le contenu de ce corps est en format JSON, il est donc analysé à l'aide de JSON.parse pour obtenir un objet JavaScript utilisable.thingObject est créé en analysant le contenu du champ thing dans req.body. Ce champ contient les données de l'objet à créer. JSON.parse est utilisé pour convertir la chaîne JSON en un objet JavaScript.
  delete thingObject._userId;//La propriété _userId de l'objet thingObject est supprimée. Cela peut être nécessaire si cette propriété ne doit pas être fournie par l'utilisateur et est générée automatiquement, par exemple, en utilisant le middleware auth qui extrait l'ID de l'utilisateur à partir du token.
  const thing = new Thing({//Cette ligne crée une nouvelle instance d'un modèle Mongoose routerelé "Thing". Le modèle "Thing" est utilisé pour interagir avec la base de données et représente la structure des objets stockés dans la base de données. L'objet créé est initialisé avec les données provenant de req.body.
    /* L'objet thingObject est étendu (spread) dans l'objet thing. Cela signifie que toutes les propriétés de thingObject sont copiées dans thing. En plus des propriétés de thingObject, deux autres propriétés sont ajoutées :
      userId : L'ID de l'utilisateur actuellement authentifié (extraite du token à l'aide du middleware auth).
      imageUrl : L'URL de l'image téléchargée. Cette URL est construite en utilisant req.protocol (HTTP ou HTTPS), req.get('host') (l'hôte du serveur) et le nom de fichier du fichier image téléchargé.*/
    ...thingObject,
    //•	Nous supprimons le champ_userId de la requête envoyée par le client car nous ne devons pas lui faire confiance (rien ne l’empêcherait de nous passer le userId d’une autre personne). Nous le remplaçons en base de données par le _userId extrait du token par le middleware d’authentification.
    userId: req.auth.userId,
    //•	Nous devons également résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename. Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http'). Nous ajoutons '://', puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000'). Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });
  thing.save()//enregistre l'objet thing dans la base de données en utilisant la méthode .save() fournie par Mongoose.La méthode save() renvoie une Promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))//Une fois que l'objet est enregistré, le code dans le bloc .then() est exécuté pour renvoyer une réponse de succès.
    .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant l'enregistrement, le code dans le bloc .catch() est exécuté pour renvoyer une réponse d'erreur avec les détails de l'erreur.
  };

  exports.getOneThing = (req, res, next) => {//Cette ligne configure une route GET pour l'URL /api/stuff/:id. Le paramètre :id indique qu'il s'agit d'un paramètre dynamique dans l'URL, ce qui signifie que l'identifiant de l'objet "thing" sera passé comme partie de l'URL. Par exemple, /api/stuff/123 récupérera l'objet avec l'identifiant "123".
    Thing.findOne({ _id: req.params.id })//Cette ligne effectue une recherche dans la base de données MongoDB pour trouver un objet "thing" ayant un _id correspondant à la valeur passée dans req.params.id. req.params est un objet qui contient les paramètres dynamiques extraits de l'URL de la requête.
      .then(thing => res.status(200).json(thing))//Une fois que la recherche est effectuée avec succès et qu'un objet "thing" est trouvé, le code dans le bloc .then() est exécuté. Il prend en paramètre l'objet "thing" récupéré depuis la base de données et renvoie une réponse JSON au client.La réponse est configurée avec un code de statut 200 (OK), indiquant que la requête s'est bien déroulée, et l'objet "thing" récupéré est converti en format JSON.
      .catch(error => res.status(404).json({ error }));//Si aucune correspondance n'est trouvée dans la base de données (l'objet "thing" n'existe pas avec l'identifiant spécifié), le code dans le bloc .catch() est exécuté. Il renvoie une réponse d'erreur au client avec un code de statut 404 (Non trouvé), indiquant que la ressource demandée n'a pas été trouvée.
  };

  exports.modifyThing = (req, res, next) => {//Cette ligne configure une route PUT pour l'URL /api/stuff/:id. Le paramètre :id indique qu'il s'agit d'un paramètre dynamique dans l'URL, ce qui signifie que l'identifiant de l'objet "thing" à mettre à jour sera passé comme partie de l'URL. Par exemple, /api/stuff/123 mettra à jour l'objet avec l'identifiant "123".
    //thingObject est créé en fonction de la présence de req.file. Si req.file existe, cela signifie qu'un nouveau fichier image a été téléchargé avec la requête. 
    const thingObject = req.file ? {
      ...JSON.parse(req.body.thing),//Dans ce cas, thingObject est construit en utilisant les données JSON du champ thing dans le corps de la requête. 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//L'URL de l'image est construite en utilisant req.protocol, req.get('host'), et le nom du fichier téléchargé. 
    } : { ...req.body };//Si req.file n'existe pas, thingObject est simplement construit à partir de req.body. 
    delete thingObject._userId;////La propriété _userId de l'objet thingObject est supprimée. Cela peut être nécessaire si cette propriété ne doit pas être fournie par l'utilisateur et est générée automatiquement, par exemple, en utilisant le middleware auth qui extrait l'ID de l'utilisateur à partir du token.
    //une recherche est effectuée dans la base de données à l'aide de Thing.findOne(). On cherche un document "thing" ayant le même _id que celui passé dans req.params.id. Si l'objet est trouvé, la fonction .then() est exécutée, sinon la fonction .catch() gère les erreurs.
    Thing.findOne({_id: req.params.id})
       .then((thing) => {
          //il est vérifié si l'ID de l'utilisateur qui souhaite mettre à jour l'objet correspond à l'ID de l'utilisateur qui a initialement créé l'objet. Si ce n'est pas le cas, une réponse avec un code de statut 401 (Non autorisé) est renvoyée.
           if (thing.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
            //Si l'utilisateur est autorisé à mettre à jour l'objet, la méthode .updateOne() de Mongoose est utilisée pour effectuer la mise à jour. 
              Thing.updateOne({ _id: req.params.id},//Cette ligne utilise la méthode .updateOne() de Mongoose pour mettre à jour un document dans la base de données. Elle prend deux arguments :Le premier argument spécifie les critères de recherche pour trouver le document à mettre à jour. Dans ce cas, on recherche un document ayant le même _id que celui passé dans req.params.id.
              { ...thingObject, _id: req.params.id})//Le deuxième argument spécifie les nouvelles valeurs à attribuer au document. thingObject contient les nouvelles données pour l'objet "thing" que l'on souhaite mettre à jour. En ajoutant _id: req.params.id, on garantit que l'identifiant de l'objet reste le même, car les mises à jour ne doivent pas modifier l'identifiant de l'objet.
              .then(() => res.status(200).json({ message: 'Objet modifié !'}))//Une fois que la mise à jour est effectuée avec succès, le code dans le bloc .then() est exécuté. Il renvoie une réponse JSON au client avec un code de statut 200 (OK), indiquant que la mise à jour a été effectuée avec succès.
              .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant la mise à jour, le code dans le bloc .catch() est exécuté. Il renvoie une réponse d'erreur au client avec un code de statut 400 (Mauvaise requête), et les détails de l'erreur sont inclus dans la réponse sous forme d'un objet JSON.
              }})
        //Si une erreur survient pendant la mise à jour ou la recherche, une réponse d'erreur est renvoyée avec un code de statut 400 (Mauvaise requête), et les détails de l'erreur sont inclus dans la réponse sous forme d'un objet JSON.
        .catch((error) => {
            res.status(400).json({ error });
        });
      };


  exports.deleteThing = (req, res, next) => {//Cette ligne configure une route DELETE pour l'URL /api/stuff/:id. Le paramètre :id indique qu'il s'agit d'un paramètre dynamique dans l'URL, ce qui signifie que l'identifiant de l'objet "thing" à supprimer sera passé comme partie de l'URL. Par exemple, /api/stuff/123 supprimera l'objet avec l'identifiant "123".
    Thing.findOne({ _id: req.params.id})//Thing.findOne({ _id: req.params.id}): Cette ligne recherche un document dans la collection MongoDB associée au modèle Thing. Elle utilise l'identifiant passé dans req.params.id pour spécifier le critère de recherche. Si l'objet est trouvé, il est stocké dans la variable thing.
      .then(thing => {
        //On vérifie si l'utilisateur authentifié (identifié par req.auth.userId) est bien le propriétaire de l'objet "thing". Si ce n'est pas le cas, une réponse avec le code d'état 401 (Non autorisé) est renvoyée, indiquant que l'utilisateur n'est pas autorisé à supprimer cet objet.
           if (thing.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = thing.imageUrl.split('/images/')[1];//Si l'utilisateur est autorisé, on extrait le nom de fichier de l'image associée à l'objet "thing" pour pouvoir le supprimer ultérieurement.
               fs.unlink(`images/${filename}`, () => {//on utilise la fonction fs.unlink() pour supprimer physiquement le fichier image du serveur. Une fois que le fichier est supprimé, on continue avec la suppression de l'objet dans la base de données. On lui passe le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé.
                Thing.deleteOne({ _id: req.params.id })//Cette ligne utilise la méthode .deleteOne() de Mongoose pour supprimer un document de la base de données. Elle prend un argument qui spécifie les critères de recherche pour trouver le document à supprimer. Dans ce cas, on recherche un document ayant le même _id que celui passé dans req.params.id.
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))//Une fois que la suppression est effectuée avec succès, le code dans le bloc .then() est exécuté. Il renvoie une réponse JSON au client avec un code de statut 200 (OK), indiquant que l'objet a été supprimé avec succès.
              .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant la suppression, le code dans le bloc .catch() est exécuté. Il renvoie une réponse d'erreur au client avec un code de statut 400 (Mauvaise requête), et les détails de l'erreur sont inclus dans la réponse sous forme d'un objet JSON.
            });
          }
        })
      //Si une erreur survient pendant le processus de suppression (par exemple, si l'objet n'a pas été trouvé dans la base de données), la fonction .catch(error => { ... }) est exécutée. Elle renvoie une réponse d'erreur avec un code d'état 400 (Mauvaise requête) et inclut les détails de l'erreur dans la réponse sous forme d'un objet JSON. Si une erreur survient pendant la suppression du fichier image, elle peut également être gérée ici.
      .catch( error => {
          res.status(500).json({ error });
      });
};


  exports.getAllStuff = (req, res, next) => {//La string api/stuff correspond à la route pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route serahttp://localhost:3000/api/stuff , car il s'agit de l'URL demandée par l'application front-end.
    Thing.find()//Cette section effectue une recherche dans la base de données MongoDB pour récupérer tous les objets "things". La méthode .find() est fournie par Mongoose et permet de rechercher des documents dans une collection.
    .then(things => res.status(200).json(things))//Une fois que la recherche est effectuée, le code dans le bloc .then() est exécuté. Il renvoie une réponse JSON avec un code de statut 200 (OK) et les objets "things" récupérés depuis la base de données.
    .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant la recherche, le code dans le bloc .catch() est exécuté pour renvoyer une réponse d'erreur avec les détails de l'erreur.
  };