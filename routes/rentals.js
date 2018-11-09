const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Fawn = require('fawn');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');

Fawn.init(mongoose);


router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort(-dateOut);
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) res.status(404).send('Rental not found');
    res.send(rental);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Customer not found');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Movie not found');

    if (movie.numberInStock === 0) return res.status(400).send('not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        //dateOut: req.body.dateOut,
        //optional dateReturned: req.body.dateReturned,
        //optional rentalFee: req.body.rentalFee
    });

    try {
        new Fawn.Task()
            .save('rentals', rental) //rentals is the collection in the mongo db.
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run()
        //rental = await rental.save();

        //movie.numberInStock--;
        //movie.save();

        res.send(rental);
    }
    catch (ex) {
        res.status(500).send('Something failed');
    }

});

module.exports = router;