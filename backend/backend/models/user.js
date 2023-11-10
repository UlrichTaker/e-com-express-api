const mongoose = require('mongoose');

//importe un package supplémentaire appelé "mongoose-unique-validator". Ce package est utilisé pour ajouter une validation personnalisée aux champs uniques du schéma Mongoose, ce qui simplifie la gestion des erreurs liées à l'unicité des données.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Le schéma "userSchema" est étendu avec le plugin "uniqueValidator". Cela permet à Mongoose d'appliquer une validation personnalisée pour les champs marqués comme uniques (unique: true) dans le schéma. Si un utilisateur tente d'ajouter un document avec une adresse e-mail déjà existante, le plugin générera une erreur appropriée.
userSchema.plugin(uniqueValidator);

//le modèle Mongoose "User" est créé à partir du schéma "userSchema" en utilisant mongoose.model(). Le modèle est nommé "User" et sera utilisé pour interagir avec la collection "users" dans la base de données MongoDB. Une instance de ce modèle représente un utilisateur et peut être utilisée pour effectuer des opérations de base de données telles que la création, la recherche, la mise à jour et la suppression d'utilisateurs.
module.exports = mongoose.model('User', userSchema);
