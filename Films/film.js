const mongoose = require("mongoose");

const FilmSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    titre: {
        type: String,
        required: true
    },
    pays: {
        type: String,
        required: true
    },
    annee: {
        type: Number,
        required: true
    },
    duree: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Film", FilmSchema);
