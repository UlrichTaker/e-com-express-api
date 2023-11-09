//Importer le package HTTP natif de Node 
const http = require('http');

const server = http.createServer((req, res) => {//créer un serveur en passant une fonction qui sera exécutée à chaque appel effectué vers ce serveur. Cette fonction reçoit les objets request et response en tant qu'arguments
    res.end('Voilà la réponse du serveur !');//utiliser la méthode end de l'objet réponse pour renvoyer une réponse de type string à l'appelant
});

server.listen(process.env.PORT || 3000);//vous configurez le serveur pour qu'il écoute :•	soit la variable d'environnement du port grâce à process.env.PORT : si la plateforme de déploiement propose un port par défaut, c'est celui-ci qu'on écoutera ;•	soit le port 3000.

