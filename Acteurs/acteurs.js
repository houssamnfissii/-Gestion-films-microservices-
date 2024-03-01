const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Acteur = require("./acteur");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const uri = 'mongodb+srv://houssamnfs20:KB260793@cluster0.4s5o85k.mongodb.net/';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB !!!'))
    .catch(err => console.error('Could not connect to MongoDB', err));


app.get('/acteurs', async (req, res) => {
    try {
        const acteurs = await Acteur.find();
        res.json({ acteurs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get('/acteurs/:id', async (req, res) => {
    try {
        const acteur = await Acteur.findOne({ id: req.params.id }); 
        if (!acteur) {
            return res.status(404).json({ error: "Actor not found" });
        }
        res.json(acteur);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/acteurs', async (req, res) => {
    try {
        const { id, nom, prenom, pays, date_naissance, tel } = req.body;

        if (!id || !nom || !prenom || !pays || !date_naissance || !tel ) {
            return res.status(400).json({ error: "kolxi mouhem requird" });
        }
        const newActeur = new Acteur({id,nom,prenom,pays ,date_naissance,tel});
        await newActeur.save();
        console.log("New Acteur created!");
        res.json({ message: "A new Acteur added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(2021, () => console.log(`Server running on port ${2021}`));