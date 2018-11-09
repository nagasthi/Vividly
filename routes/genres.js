const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validate } = require('../models/genre');
// const genres = [
//     { id: 1, name: 'comedy' },
//     { id: 2, name: 'action' },
//     { id: 3, name: 'love' }
// ];


router.get('/', async (req, res) => {

    try {
        const genres = await Genre.find();
        res.send(genres);
    }
    catch (ex) {
        next(ex);
    }
});

router.get('/:id', async (req, res) => {
    //const genre = genres.find(g => g.id === parseInt(req.params.id));
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre not found');

    res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();

    //genres.push(genre);
    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //const genre = genres.find(g => g.id === parseInt(req.params.id));
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        }
    }, { new: true });
    if (!genre) return res.status(404).send('Genre not found');
    // genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    //const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('Genre not found');

    //const index = genres.indexOf(genre);
    //genres.splice(index, 1);

    res.send(genre);

});

module.exports = router;