const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const { User } = require('../models/user');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email or password is incorrect');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email or password is incorrect');

    const token = user.generateUserToken();
    res.send(token);

});

function validateUser(req) {
    const schema = {
        //name: Joi.string().min(5).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(1024)
    }
    return Joi.validate(req, schema);
};


module.exports = router;