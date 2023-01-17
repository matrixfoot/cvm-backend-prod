const mongoose = require('mongoose');


const contactSchema = mongoose.Schema({
  email: { type: String, required: true},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  
  mobile: { type: String, required: true },
  ficheUrl: { type: String, required: false },
  description: { type: String, required: true },
  statut: { type: String},
  affecte: { type: String},
  dateaffectation: { type: Date},
  created: { type: Date, default: Date.now },
  updated: { type: Date}
});


module.exports = mongoose.model('Contact', contactSchema);