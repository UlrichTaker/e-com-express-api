const express = require('express');

const app = express();//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
//Cette section définit un middleware global en utilisant app.use. Le middleware est une fonction qui est exécutée pour chaque requête entrante. Dans ce cas, le middleware envoie une réponse JSON avec le message "Votre requête a bien été reçue !" en réponse à toutes les requêtes.
app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
