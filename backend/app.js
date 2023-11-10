const express = require('express');

const app = express();//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.

app.use((req, res, next) => {//le middleware ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes. Cela permettra à toutes les demandes de toutes les origines d'accéder à votre API
  res.setHeader('Access-Control-Allow-Origin', '*');//accéder à notre API depuis n'importe quelle origine ( '*' ) ;
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  next();
});

app.use('/api/stuff', (req, res, next) => {//La string api/stuff correspond à la route pour laquelle nous souhaitons enregistrer cet élément de middleware. Dans ce cas, cette route serahttp://localhost:3000/api/stuff , car il s'agit de l'URL demandée par l'application front-end.
    const stuff = [
      {//Dans ce middleware, nous créons un groupe d'articles avec le schéma de données spécifique requis par le front-end. Nous envoyons ensuite ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie.
        _id: 'oeihfzeoi',
        title: 'Mon premier objet',
        description: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 4900,
        userId: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeomoihi',
        title: 'Mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        price: 2900,
        userId: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
  });
  

module.exports = app;//Cette ligne crée une instance d'Express en appelant express(). app devient l'instance principale de l'application Express, à travers laquelle vous pouvez configurer des routes et des gestionnaires de requêtes.
