const express = require("express");
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Participation = require("./participation");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const uri = 'mongodb+srv://houssamnfs20:KB260793@cluster0.4s5o85k.mongodb.net/';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB !!!'))
    .catch(err => console.error('Could not connect to MongoDB', err));


    app.post('/participations', async (req, res) => {
        try {
            const { film_id, acteur_id, role } = req.body;
    
            const filmResponse = await axios.get(`http://localhost:2020/films/${film_id}`);
            if (filmResponse.status !== 200) {
                return res.status(404).json({ error: "Film not found" });
            }
    
            const actorResponse = await axios.get(`http://localhost:2021/acteurs/${acteur_id}`);
            if (actorResponse.status !== 200) {
                return res.status(404).json({ error: "Actor not found" });
            }
    
          
            const existingParticipation = await Participation.exists({ film_id, acteur_id });
            if (existingParticipation) {
                return res.status(400).json({ error: "Participation already exists" });
            }
    
            const newParticipation = new Participation({ film_id, acteur_id, role });
            await newParticipation.save();
            console.log("New Participation added!");
            res.json({ message: "A new Participation added" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });


app.get('/participations/:film_id/:acteur_id', async (req, res) => {
    try {
        const { film_id, acteur_id } = req.params;

        const participation = await Participation.findOne({ film_id, acteur_id });

        if (!participation) {
            return res.status(404).json({ error: 'Participation not found' });
        }
        res.json(participation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/participationss/film/:titre', async (req, res) => {
    try {
        const { titre } = req.params;
        
        const film = await axios.get(`http://localhost:2020/films/titre/${titre}`);

        if ( !film.data) {
            
            return res.status(404).json({ error: 'Film not found' });
        }
        
        const filmId = film.data.id;
        console.log(filmId);
        
        const participations = await Participation.find({ film_id: filmId });

        res.json(participations);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.get('/participationss/acteurs/:titre', async (req, res) => {
    try {
        const { titre } = req.params;
        
        const film = await axios.get(`http://localhost:2020/films/titre/${titre}`);

        if (!film.data) {
            return res.status(404).json({ error: 'Film not found' });
        }

        const filmId = film.data.id;
        
        const participations = await Participation.find({ film_id: filmId });

        const acteurIds = participations.map(participation => participation.acteur_id);

        const acteurPromises = acteurIds.map(async actorId => {
            const acteur = await axios.get(`http://localhost:2021/acteurs/${acteurIds}`);
            return acteur.data;
        });
        const acteurs = await Promise.all(acteurPromises);

        res.json(acteurs);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.get('/participations/roles/:acteurN', async (req, res) => {
    try {
        const { actor_name } = req.params;
        const actorResponse = await axios.get(`http://localhost:2021/acteurs`, {
            params: {
                name: actor_name
            }
        });

        if (!actorResponse.data || actorResponse.data.length === 0) {
            return res.status(404).json({ error: 'Actor not found' });
        }

        const actorId = actorResponse.data[0].id; 

        const participations = await Participation.find({ acteur_id: actorId });

        const filmIds = participations.map(participation => participation.film_id);

        const films = await axios.get(`http://localhost:2020/films`, {
            params: {
                ids: filmIds.join(',')
            }
        });

        const roles = participations.map(participation => {
            const film = films.data.find(film => film.id === participation.film_id);
            return {
                film_id: participation.film_id,
                titre: film.title,
                role: participation.role
            };
        });

        res.json(roles);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response && error.response.status) {
            res.status(error.response.status).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.listen(2022, () => console.log(`Server running on port ${2022}`));