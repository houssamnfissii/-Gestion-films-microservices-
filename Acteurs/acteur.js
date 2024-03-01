const mongoose = require("mongoose");

const ActeurSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    pays: {
        type: String,
        required: true
    },
    date_naissance: {
        type: Date,
        required: true
    },
    tel: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Acteur", ActeurSchema);

