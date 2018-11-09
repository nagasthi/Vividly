const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: Boolean,
    name: String,
    phone: String
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomers(customer) {
    const schema = {
        isGold: Joi.boolean(),
        name: Joi.string().required().min(4),
        phone: Joi.string()        
    };
    return Joi.validate(customer, schema);
};

module.exports.Customer = Customer;
exports.validate = validateCustomers; 