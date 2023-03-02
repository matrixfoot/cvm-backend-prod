const mongoose = require('mongoose');


const carouselSchema = mongoose.Schema({
  titre: { type: String},
  commentaire: { type: String},
  description: { type: String},
  rang: { type: Number},
  ficheUrl: { type: String},
  created: { type: Date, default: Date.now },
  updated: { type: Date},
  tarifs: [],

});


module.exports = mongoose.model('Carousel', carouselSchema);