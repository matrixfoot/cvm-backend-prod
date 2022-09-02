const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    ficheUrl: {
        type: String
    },
    created: { type: Date, default: Date.now },
  updated: { type: Date}
});

module.exports = mongoose.model('Event', eventSchema);