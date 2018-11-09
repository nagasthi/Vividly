const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: String
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenres(genre) {
    const schema = {
        name: Joi.string().required().min(3)
    };
    return Joi.validate(genre, schema);
};

exports.Genre = Genre;
exports.validate = validateGenres;
exports.genreSchema = genreSchema;