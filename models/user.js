const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String},
  confirmpassword: { type: String},
  acceptTerms:{ type: Boolean},
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  fonction: { type: String,},
  secteur: { type: String,},
  adresseactivite: { type: String,},
  codepostal: { type: String,},
  ficheUrl: { type: String,},
  natureactivite: { type: String,},
  activite: { type: String,},
  sousactivite: { type: String,},
  regimefiscalimpot: { type: String,},
  regimefiscaltva: { type: String,},
  matriculefiscale: { type: String,},
  civilite: { type: String, required: true },
  usertype: { type: String, required: true },
  mobile: { type: String, required: true },
  raisonsociale: { type: String,},
  nomsociete: { type: String,},
  clientcode:{ type: String, required: true },
  choixfacture:{type:String},
  numeronote:{type:String},

  role: {
    type: String,
    default: 'basic',
    enum: ["basic", "supervisor", "admin"]
   },
   accessToken: {
    type: String
   },
   verified: { type: Date},
    resetToken: { 
        token: String,
        expires: Date
    },
    passwordReset: { type: Date},
    created: { type: Date, default: Date.now },
    updated: { type: Date},
    desactive: { 
      statut: Boolean, default: false,
      date: Date
  },
  restaured: { type: Date},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);