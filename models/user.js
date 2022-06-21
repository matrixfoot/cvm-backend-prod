const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  fonction: { type: String, required: true },
  secteur: { type: String, required: true },
  civilite: { type: String, required: true },
  raisonsociale: { type: String, required: true },
  nomsociete: { type: String, required: true },
  clientcode:{ type: String, required: true },
  role: {
    type: String,
    default: 'basic',
    enum: ["basic", "supervisor", "admin"]
   },
   accessToken: {
    type: String
   }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);