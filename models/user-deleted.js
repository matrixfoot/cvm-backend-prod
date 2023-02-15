const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userdeletedSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String },
  confirmpassword: { type: String },
  acceptTerms:{ type: Boolean},
  firstname: { type: String },
  lastname: { type: String },
  fonction: { type: String,},
  secteur: { type: String,},
  adresseactivite: { type: String,},
  codepostal: { type: String,},
  ficheUrl: { type: String,},
  natureactivite: { type: String,},
  activite: { type: String,},
  sousactivite: { type: String,},
  specialite: { type: String,},
  sousspecialite: { type: String,},
  regimefiscalimpot: { type: String,},
  regimefiscaltva: { type: String,},
  matriculefiscale: { type: String,},
  civilite: { type: String },
  nature: { type: String },
  usertype: { type: String },
  mobile: { type: String },
  raisonsociale: { type: String,},
  nomsociete: { type: String,},
  clientcode:{ type: String },
  choixfacture:{type:String},
  numeronote:{type:String},
  droitcompta:{type:String},
  rolesuperviseur:{type:String},
  role: {
    type: String,
   
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
    created: { type: Date},
    updated: { type: Date},
    connected: { type: Boolean, default:false},
    desactive: { 
      statut: Boolean,
      date: Date
  },
  deleted: { 
    
    type: Date
}
});

userdeletedSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Userdeleted', userdeletedSchema);