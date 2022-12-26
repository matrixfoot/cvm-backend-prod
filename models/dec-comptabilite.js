
const mongoose = require('mongoose');


const deccomptabiliteSchema = mongoose.Schema({
  userId: { type: String},
  nature: { type: String},
  mois: { type: String},
  annee: { type: String},
  statut: { type: String,default:''},
  motif: { type: String,default:''},
  ficheUrl: { type: String},
  created: { type: Date, default: Date.now },
  updated: { type: Date},
  debitmoisprecedent:{ type: String},
  creditmoisprecedent:{ type: String},
  mois:{ type: String},
  annee:{ type: String},
  autre1: [],
  autre2: [],
  autre3: [],
  autre4: [],
  autre5: [],
  autre6: []

});


module.exports = mongoose.model('Deccomptabilite', deccomptabiliteSchema);