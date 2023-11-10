//Importer le package HTTP natif de Node 
const http = require('http');

const app = require('./app');

app.set('port', process.env.PORT || 3000);//Cette ligne configure le serveur en définissant un paramètre nommé 'port' dans l'objet app. Il utilise process.env.PORT pour obtenir le numéro de port à partir des variables d'environnement. Si aucune variable d'environnement PORT n'est définie, le port par défaut est 3000.
const server = http.createServer(app);//Cette ligne crée un serveur HTTP en utilisant la fonction createServer du module http. Le serveur est configuré pour utiliser l'objet app comme gestionnaire de requêtes. Cela signifie que toutes les requêtes HTTP reçues par le serveur seront gérées par l'application définie dans app.

server.listen(process.env.PORT || 3000);//vous configurez le serveur pour qu'il écoute :•	soit la variable d'environnement du port grâce à process.env.PORT : si la plateforme de déploiement propose un port par défaut, c'est celui-ci qu'on écoutera ;•	soit le port 3000.

