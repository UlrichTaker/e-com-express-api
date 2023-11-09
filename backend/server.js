const http = require('http');
const app = require('./app');

//La fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne.Elle tente de normaliser le port sur lequel le serveur écoutera. Elle prend en entrée une valeur val, tente de la convertir en entier, et retourne val si elle ne peut pas être convertie en entier. Sinon, elle retourne le port s'il est supérieur ou égal à zéro, sinon elle retourne false 
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Cette section utilise la fonction normalizePort pour déterminer le port sur lequel le serveur écoutera. Elle vérifie d'abord s'il existe une variable d'environnement PORT et l'utilise, sinon elle utilise le port par défaut 3000. 
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);// configure l'application Express pour utiliser ce port en utilisant app.set('port', port)

// La fonction errorHandler est définie pour gérer les erreurs potentielles lors de la configuration du serveur. Elle vérifie si l'erreur est liée à l'appel système "listen" du serveur. En cas d'erreur, elle affiche un message d'erreur spécifique et, dans certains cas, termine le processus Node.js avec process.exit(1).
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Cette ligne crée un serveur HTTP en utilisant le module http et configure l'application Express app comme gestionnaire de requêtes.
const server = http.createServer(app);

// Ces lignes définissent des gestionnaires d'événements pour le serveur. L'événement 'error' est utilisé pour gérer les erreurs, comme défini dans la fonction errorHandler. L'événement 'listening' est utilisé pour afficher un message indiquant sur quel port le serveur écoute lorsque le serveur démarre.    
server.on('error', errorHandler);//Cette ligne configure un gestionnaire d'événements pour l'événement 'error' du serveur. Cela signifie que lorsqu'une erreur survient dans le serveur, la fonction errorHandler sera appelée pour gérer cette erreur.
server.on('listening', () => {//Cette ligne configure un gestionnaire d'événements pour l'événement 'listening' du serveur. Cela signifie que lorsque le serveur commence à écouter les requêtes entrantes sur un port spécifique, la fonction fléchée sera exécutée.
  const address = server.address();//Cette ligne récupère les informations sur l'adresse sur laquelle le serveur écoute. L'objet address contient des informations telles que l'adresse IP et le port.
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;//Cette ligne crée une chaîne bind qui décrit comment le serveur est lié. Si address est une chaîne (par exemple, lorsqu'il est lié à un pipe), la chaîne "pipe" est ajoutée avant l'adresse. Sinon, la chaîne "port" est ajoutée avant le numéro de port port.
  console.log('Listening on ' + bind);
});

// Cette ligne démarre effectivement le serveur en l'écoutant sur le port configuré (port) en utilisant server.listen(port)
server.listen(port);
