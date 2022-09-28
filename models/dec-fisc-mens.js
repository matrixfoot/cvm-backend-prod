
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
  statut: { type: String,default:''},
  motif: { type: String,default:''},
  ficheUrl: { type: String},
  created: { type: Date, default: Date.now },
  updated: { type: Date},
  impottype1: {
    type:{ type: String},
    traitementetsalaire:{
    salairebrut:{type:Number},
    salaireimposable:{type:Number},
    retenuealasource:{type:Number},
    contributionsociale:{type:Number}
    },
    location1:{
        type:{ type: String},
        montantbrut:{type:Number},
        montantnet:{type:Number},
        montantretenue:{type:Number},
        },
        location2:{
                type:{ type: String},
                montantbrut:{type:Number},
                montantnet:{type:Number},
                montantretenue:{type:Number},
                },
                location3:{
                        type:{ type: String},
                        montantbrut:{type:Number},
                        montantnet:{type:Number},
                        montantretenue:{type:Number},
                        },
                        location4:{
                                type:{ type: String},
                                montantbrut:{type:Number},
                                montantnet:{type:Number},
                                montantretenue:{type:Number},
                                },
    honoraire1:{
            type:{ type: String},
            montantbrut:{type:Number},
            montantnet:{type:Number},
            montantretenue:{type:Number},
            },
            honoraire2:{
                type:{ type: String},
                montantbrut:{type:Number},
                montantnet:{type:Number},
                montantretenue:{type:Number},
                },
                honoraire3:{
                        type:{ type: String},
                        montantbrut:{type:Number},
                        montantnet:{type:Number},
                        montantretenue:{type:Number},
                        },
    montant10001:{
            type:{ type: String},
            montantbrut:{type:Number},
            montantnet:{type:Number},
            montantretenue:{type:Number},
            },
            montant10002:{
                type:{ type: String},
                montantbrut:{type:Number},
                montantnet:{type:Number},
                montantretenue:{type:Number},
                },
                montant10003:{
                        type:{ type: String},
                        montantbrut:{type:Number},
                        montantnet:{type:Number},
                        montantretenue:{type:Number},
                        },
                        montant10004:{
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
  
}});


module.exports = mongoose.model('Decfiscmens', decfiscmensSchema);