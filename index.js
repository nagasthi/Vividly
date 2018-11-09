const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const config = require('config');
const app = express();
const genres = require('./routes/genres');
const home = require('./routes/home');
const mongoose = require('mongoose');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth.js');
const error = require('./middleware/error');

mongoose.connect('mongodb://localhost/vividly')
    .then(() => console.log('connected succesfully to mongoDB'))
    .catch((err) => console.log(err.message));

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: Private Key not set');
    process.exit(1);
}


app.use(express.json());
app.use('/api/genres', genres);
app.use('/', home);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

const port = process.env.PORT || 3000; // set PORT=5000 in cmd prompt if needed
app.listen(port, () =>
    console.log(`Listening on port ${port}`)
);