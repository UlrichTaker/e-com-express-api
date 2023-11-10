const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

//Toutes les routes sont protégées par le middleware auth, ce qui signifie que l'utilisateur doit être authentifié pour y accéder

//Recuperer tous les objets
router.get('/', auth, stuffCtrl.getAllStuff);

//Enregistrement des objets
router.post('/', auth, stuffCtrl.createThing);
  
//Recuperation d'une thing specifique
router.get('/:id', auth, stuffCtrl.getOneThing);

//Modification d'un objet
router.put('/:id', auth, stuffCtrl.modifyThing);
  
//Supprimer un objet
router.delete('/:id', auth, stuffCtrl.deleteThing);


module.exports = router;
