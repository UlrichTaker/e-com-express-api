const express = require('express');

const app = express();//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.

//Ce middleware enregistre « Requête reçue ! » dans la console et passe l'exécution ;
app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();//passer le contrôle à la prochaine fonction middleware dans la chaîne de traitement des requêtes. Cela permet d'exécuter d'autres middleware ou de gérer davantage la requête en cours
  });

  
//ajoute un code d'état 201 à la réponse et passe l'exécution   
app.use((req, res, next) => {
    res.status(201);
    next();
  });

//Cette section définit un middleware global en utilisant app.use. Le middleware est une fonction qui est exécutée pour chaque requête entrante. Dans ce cas, le middleware envoie une réponse JSON avec le message "Votre requête a bien été reçue !" en réponse à toutes les requêtes.
app.use((req, res, next) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

//enregistre « Réponse envoyée avec succès ! » dans la console
app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
  });  

module.exports = app;//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
