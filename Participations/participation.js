const mongoose = require("mongoose");

const ParticipationSchema = new mongoose.Schema({
    film_id: {
        type: String,
        required: true
    },
    acteur_id: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Participation", ParticipationSchema);
