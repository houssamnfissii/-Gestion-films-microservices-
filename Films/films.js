const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Film = require("./film");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const uri = 'mongodb+srv://houssamnfs20:KB260793@cluster0.4s5o85k.mongodb.net/';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
    res.send("Welcome to the film service");
});

app.post("/film", async (req, res) => {
    try {
        const { id, titre, pays, annee, duree, genre } = req.body;
        if (!id || !titre || !pays || !annee || !duree || !genre) {
            return res.status(400).json({ error: "kolxi mouhem requird" });
        }
        const newFilm = new Film({ id, titre, pays, annee, duree, genre });
        await newFilm.save();
        console.log("New Film created!");
        res.json({ message: "A new Film added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/films', async (req, res) => {
    try {
        const films = await Film.find();
        res.json({ films });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/films/:id', async (req, res) => {
    try {
        const film = await Film.findOne({ id: req.params.id }); 
        if (!film) {
            return res.status(404).json({ error: "Film not found" });
        }
        res.json(film);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/films/titre/:titre', async (req, res) => {
    try {
        const films = await Film.findOne({ titre: req.params.titre });
        res.json(films);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(2020, () => console.log(`Server running on port ${2020}`));
