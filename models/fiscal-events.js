const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
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