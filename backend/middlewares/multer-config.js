//Ce code configure l'utilisation de multer, une bibliothèque Node.js pour la gestion des fichiers téléchargés (upload) dans le contexte d'une application Express. Il permet d'uploader des fichiers image et de gérer leur stockage

const multer = require('multer');

//Un objet MIME_TYPES est défini pour mapper les types MIME d'images courants (image/jpg, image/jpeg, image/png) aux extensions de fichiers correspondantes (jpg, jpg, png). Les types MIME couramment utilisés pour les images (par exemple, jpg, jpeg, png)
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images   
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
  filename: (req, file, callback) => {//Cette fonction permet de déterminer le nom du fichier une fois qu'il est téléchargé. Il prend le nom d'origine du fichier, remplace les espaces par des underscores, ajoute la date actuelle (en millisecondes) et l'extension du fichier en fonction de son type MIME.
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.
module.exports = multer({storage: storage}).single('image');//La méthode .single('image') signifie que cette configuration s'appliquera aux téléchargements de fichiers portant le champ nommé "image". Cela signifie que l'application peut gérer un seul fichier image à la fois.
