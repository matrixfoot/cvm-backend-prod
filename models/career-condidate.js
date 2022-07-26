const mongoose = require('mongoose');


const condidateSchema = mongoose.Schema({
  email: { type: String, required: true},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  adresse: { type: String, required: true },
  mobile: { type: String, required: true },
  ficheUrl: { type: String, required: false },
  description: { type: String, required: true },
  specialite: { type: String, required: true },
  decision: { type: String},
  motif: { type: String},
  created: { type: Date, default: Date.now },
  updated: { type: Date}
});


module.exports = mongoose.model('Condidate', condidateSchema);