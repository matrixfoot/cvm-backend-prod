
const mongoose = require('mongoose');


const decfiscmensSchema = mongoose.Schema({
  userId: { type: String},
  mois: { type: String},
  annee: { type: String},
  registrecommerce: { type: String},
  matriculefiscale: { type: String},
  codetva: { type: String},
  codegenre: { type: String},
  firstname: { type: String},
  lastname: { type: String},
  raisonsociale: { type: String},
  adresse: { type: String},
  codepostal: { type: String},
  activite: { type: String},
  datearretactivite: { type: Date},
  impottype1: {
    type:{ type: String},
    traitementetsalaire:{
    salairebrut:{type:Number},
    salaireimposable:{type:Number},
    retenuealasource:{type:Number},
    contributionsociale:{type:Number}
    },
    location:{
        type:{ type: String},
        montantbrut:{type:Number},
        montantnet:{type:Number},
        montantretenue:{type:Number},
        },
    honoraire:{
            type:{ type: String},
            montantbrut:{type:Number},
            montantnet:{type:Number},
            montantretenue:{type:Number},
            },
    montant1000:{
            type:{ type: String},
            montantbrut:{type:Number},
            montantnet:{type:Number},
            montantretenue:{type:Number},
            },
    autre:{
                titre:{type:String},
                montant:{type:Number},
                description:{type:Number},
                },
  statut: { type: String},
  ficheUrl: { type: String},
  created: { type: Date, default: Date.now },
  updated: { type: Date}
}});


module.exports = mongoose.model('Decfiscmens', decfiscmensSchema);