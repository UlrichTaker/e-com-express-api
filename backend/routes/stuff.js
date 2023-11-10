const express = require('express');

const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

//Recuperer tous les objets
router.get('/', stuffCtrl.getAllStuff);

//Enregistrement des objets
router.post('/', stuffCtrl.createThing);
  
//Recuperation d'une thing specifique
router.get('/:id', stuffCtrl.getOneThing);

//Modification d'un objet
router.put('/:id', stuffCtrl.modifyThing);
  
//Supprimer un objet
router.delete('/:id', stuffCtrl.deleteThing);


module.exports = router;
