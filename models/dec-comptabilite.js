
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
  moisreleve:{ type: String},
  anneereleve:{ type: String},
  totalht:{ type: String},
  totaltva:{ type: String},
  realtotaltva:{ type: String},
  totaldt:{ type: String},
  totalttc:{ type: String},
  totalht2:{ type: String},
  totaltva2:{ type: String},
  totaldt2:{ type: String},
  totalttc2:{ type: String},
  totalrecette:{ type: String},
  totalht3:{ type: String},
  totaltva3:{ type: String},
  totaldt3:{ type: String},
  totalttc3:{ type: String},
  totaldebit:{ type: String},
  totalcredit:{ type: String},
  totalsoldemois:{ type: String},
  totalsalairebrut:{ type: String},
  totalcnss:{ type: String},
  totalsalaireimposable:{ type: String},
  totalretenueimpot:{ type: String},
  totalavancepret:{ type: String},
  totalsalairenet:{ type: String},
  autre1: [],
  autre2: [],
  autre3: [],
  autre4: [],
  autre5: [],
  autre6: []

});


module.exports = mongoose.model('Deccomptabilite', deccomptabiliteSchema);