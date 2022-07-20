const mongoose = require('mongoose');


const condidateSchema = mongoose.Schema({
  email: { type: String, required: true},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  mobile: { type: String, required: true },
  description: { type: String, required: true },
  decision: { type: String},
  created: { type: Date, default: Date.now },
  updated: { type: Date}
});


module.exports = mongoose.model('Condidate', condidateSchema);