const { date } = require('joi');
const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    nature: {
        type: String,
    },
    
    natureactivite: {
        type: String,
    },
    activite: {
        type: String,
    },
    sousactivite: {
        type: String,
    },
    regimefiscal: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    ficheUrl: { type: String, required: false },
    description: {
        type: String,
        required: false,
    },
    created: { type: Date, default: Date.now },
  updated: { type: Date}
});

module.exports = mongoose.model('Event', eventSchema);