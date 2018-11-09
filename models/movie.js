const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const moviesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
});

const Movie = mongoose.model('Movie', moviesSchema);

function validateMovies(movie) {
    const schema = {
        title: Joi.string().required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    };
    return Joi.validate(movie, schema);
}

exports.validate = validateMovies;
exports.Movie = Movie;
module.exports.moviesSchema = moviesSchema;