const express = require('express');
const mongoose = require('mongoose');
const app = express();//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');


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

//utilise les routes définies dans le module stuffRoutes pour gérer les requêtes relatives aux objets "stuff". Les routes de l'API commencent par /api/stuff. Par exemple, une requête GET à /api/stuff sera gérée par stuffRoutes.
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
