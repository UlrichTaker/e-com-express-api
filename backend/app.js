const express = require('express');
const mongoose = require('mongoose');
const app = express();//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
const Thing = require('./models/thing');

//Connexion à la base de données
mongoose.connect('mongodb+srv://Abl:a8AttEnpNz8tRk5@firstcluster.jqgu5ws.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());//Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, Il permet à Express de prendre le corps de la requête JSON et de le transformer en un objet JavaScript disponible sous req.body. Cela facilite le traitement des données JSON dans les requêtes POST

//Middleware CORS: permet l'accès à l'API depuis n'importe quelle origine, définit les en-têtes autorisés, et spécifie les méthodes HTTP autorisées.
app.use((req, res, next) => {//le middleware ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes. Cela permettra à toutes les demandes de toutes les origines d'accéder à votre API
  res.setHeader('Access-Control-Allow-Origin', '*');//accéder à notre API depuis n'importe quelle origine ( '*' ) ;
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  next();
});

//Enregistrement des objets
//Cette route est configurée pour gérer uniquement les requêtes POST vers l'URL /api/stuff. Lorsqu'une requête POST est reçue à cette URL, le gestionnaire de route (la fonction anonyme) est exécuté.
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;//Cette ligne supprime la propriété _id de l'objet req.body envoyé par le frontend. L'objet req.body contient les données envoyées dans le corps de la requête POST. La suppression de _id peut être nécessaire si cet identifiant est généré automatiquement par la base de données et ne doit pas être fourni par l'utilisateur.
  const thing = new Thing({//Cette ligne crée une nouvelle instance d'un modèle Mongoose appelé "Thing". Le modèle "Thing" est utilisé pour interagir avec la base de données et représente la structure des objets stockés dans la base de données. L'objet créé est initialisé avec les données provenant de req.body.
    ...req.body//L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body 
  });
  thing.save()//enregistre l'objet thing dans la base de données en utilisant la méthode .save() fournie par Mongoose.La méthode save() renvoie une Promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))//Une fois que l'objet est enregistré, le code dans le bloc .then() est exécuté pour renvoyer une réponse de succès.
    .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant l'enregistrement, le code dans le bloc .catch() est exécuté pour renvoyer une réponse d'erreur avec les détails de l'erreur.
});

//Recuperation d'une thing specifique
app.get('/api/stuff/:id', (req, res, next) => {//Cette ligne configure une route GET pour l'URL /api/stuff/:id. Le paramètre :id indique qu'il s'agit d'un paramètre dynamique dans l'URL, ce qui signifie que l'identifiant de l'objet "thing" sera passé comme partie de l'URL. Par exemple, /api/stuff/123 récupérera l'objet avec l'identifiant "123".
  Thing.findOne({ _id: req.params.id })//Cette ligne effectue une recherche dans la base de données MongoDB pour trouver un objet "thing" ayant un _id correspondant à la valeur passée dans req.params.id. req.params est un objet qui contient les paramètres dynamiques extraits de l'URL de la requête.
    .then(thing => res.status(200).json(thing))//Une fois que la recherche est effectuée avec succès et qu'un objet "thing" est trouvé, le code dans le bloc .then() est exécuté. Il prend en paramètre l'objet "thing" récupéré depuis la base de données et renvoie une réponse JSON au client.La réponse est configurée avec un code de statut 200 (OK), indiquant que la requête s'est bien déroulée, et l'objet "thing" récupéré est converti en format JSON.
    .catch(error => res.status(404).json({ error }));//Si aucune correspondance n'est trouvée dans la base de données (l'objet "thing" n'existe pas avec l'identifiant spécifié), le code dans le bloc .catch() est exécuté. Il renvoie une réponse d'erreur au client avec un code de statut 404 (Non trouvé), indiquant que la ressource demandée n'a pas été trouvée.
});

//Modification d'un objet
app.put('/api/stuff/:id', (req, res, next) => {//Cette ligne configure une route PUT pour l'URL /api/stuff/:id. Le paramètre :id indique qu'il s'agit d'un paramètre dynamique dans l'URL, ce qui signifie que l'identifiant de l'objet "thing" à mettre à jour sera passé comme partie de l'URL. Par exemple, /api/stuff/123 mettra à jour l'objet avec l'identifiant "123".
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })//Cette ligne utilise la méthode .updateOne() de Mongoose pour mettre à jour un document dans la base de données. Elle prend deux arguments :Le premier argument spécifie les critères de recherche pour trouver le document à mettre à jour. Dans ce cas, on recherche un document ayant le même _id que celui passé dans req.params.id.Le deuxième argument spécifie les nouvelles valeurs à attribuer au document. ...req.body représente les données fournies dans le corps de la requête PUT, et _id: req.params.id garantit que l'identifiant ne sera pas modifié.
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))//Une fois que la mise à jour est effectuée avec succès, le code dans le bloc .then() est exécuté. Il renvoie une réponse JSON au client avec un code de statut 200 (OK), indiquant que la mise à jour a été effectuée avec succès.
    .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant la mise à jour, le code dans le bloc .catch() est exécuté. Il renvoie une réponse d'erreur au client avec un code de statut 400 (Mauvaise requête), et les détails de l'erreur sont inclus dans la réponse sous forme d'un objet JSON.
});

//Supprimer un objet
app.delete('/api/stuff/:id', (req, res, next) => {//Cette ligne configure une route DELETE pour l'URL /api/stuff/:id. Le paramètre :id indique qu'il s'agit d'un paramètre dynamique dans l'URL, ce qui signifie que l'identifiant de l'objet "thing" à supprimer sera passé comme partie de l'URL. Par exemple, /api/stuff/123 supprimera l'objet avec l'identifiant "123".
  Thing.deleteOne({ _id: req.params.id })//Cette ligne utilise la méthode .deleteOne() de Mongoose pour supprimer un document de la base de données. Elle prend un argument qui spécifie les critères de recherche pour trouver le document à supprimer. Dans ce cas, on recherche un document ayant le même _id que celui passé dans req.params.id.
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))//Une fois que la suppression est effectuée avec succès, le code dans le bloc .then() est exécuté. Il renvoie une réponse JSON au client avec un code de statut 200 (OK), indiquant que l'objet a été supprimé avec succès.
    .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant la suppression, le code dans le bloc .catch() est exécuté. Il renvoie une réponse d'erreur au client avec un code de statut 400 (Mauvaise requête), et les détails de l'erreur sont inclus dans la réponse sous forme d'un objet JSON.
});

//Recuperer tous les objets
// Cette route est configurée pour gérer uniquement les requêtes GET vers l'URL /api/stuff. Lorsqu'une requête GET est reçue à cette URL, le gestionnaire de route (la fonction anonyme) est exécuté.
app.get('/api/stuff', (req, res, next) => {//La string api/stuff correspond à la route pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route serahttp://localhost:3000/api/stuff , car il s'agit de l'URL demandée par l'application front-end.
  Thing.find()//Cette section effectue une recherche dans la base de données MongoDB pour récupérer tous les objets "things". La méthode .find() est fournie par Mongoose et permet de rechercher des documents dans une collection.
  .then(things => res.status(200).json(things))//Une fois que la recherche est effectuée, le code dans le bloc .then() est exécuté. Il renvoie une réponse JSON avec un code de statut 200 (OK) et les objets "things" récupérés depuis la base de données.
  .catch(error => res.status(400).json({ error }));//Si une erreur survient pendant la recherche, le code dans le bloc .catch() est exécuté pour renvoyer une réponse d'erreur avec les détails de l'erreur.
});
  

module.exports = app;//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
