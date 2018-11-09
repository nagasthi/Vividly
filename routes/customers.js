const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customers = await Customer.findById(req.params.id);
    if (!customers) return res.status(404).send('No customer found');
    res.send(customers);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });
    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: {
            isGold: req.body.isGold,
            name: req.body.name,            
            phone: req.body.phone
        }
    }, { new: true });
    if (!customer) return res.status(404).send('Customer not found');
    res.send(customer);
});

router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('customer not found');
    res.send(customer);
});

module.exports = router;
exports.Customer = Customer;