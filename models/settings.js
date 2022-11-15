const mongoose = require('mongoose');


const carouselSchema = mongoose.Schema({
  titre: { type: String},
  commentaire: { type: String},
  description: { type: String},
  ficheUrl: { type: String},
  created: { type: Date, default: Date.now },
  updated: { type: Date}
});


module.exports = mongoose.model('Carousel', carouselSchema);