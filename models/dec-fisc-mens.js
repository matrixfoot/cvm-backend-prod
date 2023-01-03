
const mongoose = require('mongoose');


const decfiscmensSchema = mongoose.Schema({
  userId: { type: String},
  nature: { type: String},
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
  sousactivite: { type: String},
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
                                autre:  []
    
  
},

impottype2: {
        type:{ type: String},
        reporttvamoisprecedent:{ type: String},
        tvacollecter:{
                type:{ type: String},
                chiffreaffaireht:{ type: String},
                tvaammount:{ type: String},
                ammountttc:{ type: String},
                
                },
                tvacollecter19:{
                        type:{ type: String},
                        chiffreaffaireht:{ type: String},
                        tvaammount:{ type: String},
                        ammountttc:{ type: String},
                        
                        },
        tvarecuperableimmobilier:{
                        type:{ type: String},
                    achatlocauxht:{ type: String},
                    achatlocauxtva:{ type: String},
                    
                    
                    },
        tvarecuperableequipement:{
                        type:{ type: String},
                    achatlocauxht:{ type: String},
                    achatlocauxtva:{ type: String},
                    achatimporteht:{ type: String},
                    achatimportetva:{ type: String},
                    
                    
                    },
        tvarecuperableautreachat:{
                        type:{ type: String},
                    achatlocauxht:{ type: String},
                    achatlocauxtva:{ type: String},
                    achatimporteht:{ type: String},
                    achatimportetva:{ type: String},
                    
                    
                    },
        locationhabitationmeuble:{
                        type:{ type: String},
                        htammount:{ type: String},
                        tvaammount:{ type: String},
                        ttcammount:{ type: String},
                        },
                        locationusagecommercial:{
                                type:{ type: String},
                                    htammount:{ type: String},
                                    tvaammount:{ type: String},
                                    ttcammount:{ type: String},
                                    },
                            operationlotissement:{
                                type:{ type: String},
                                        htammount:{ type: String},
                                        tvaammount:{ type: String},
                                        ttcammount:{ type: String},
                                        },
                            interetpercue:{
                                type:{ type: String},
                                            htammount:{ type: String},
                                            tvaammount:{ type: String},
                                            ttcammount:{ type: String},
                                            },
                            autretvaspecial:{
                                type:{ type: String},
                                                htammount:{ type: String},
                                                tvaammount:{ type: String},
                                                ttcammount:{ type: String},
                                                taux:{ type: String},
                                                }       
                                        },
impottype3: {
                                                type:{ type: String},
                                                tfpsalairebrut:{ type: String},
                                                basetfp:{ type: String},
                                                montanttfpmois:{ type: String},
                                                reporttfpmoisprecedent:{ type: String},
                                                montantavance:{ type: String},
                                                tfppayer:{ type: String},
                                                tfpreporter:{ type: String},
                                                salairesnonsoumistfp:{ type: String},      
        },
impottype4: {
        type:{ type: String},
        foprolossalairebrut:{ type: String},
        basefoprolos:{ type: String},
        montantfoprolos:{ type: String},
        salairesnonsoumisfoprolos:{ type: String},     
},
impottype5: {

        type:{ type: String},
        nombrenotehonoraire:{ type: String},
        totaldroittimbre:{ type: String},
        },
impottype6: {

                type:{ type: String},
                chiffreaffairettc:{ type: String},
                tclpayer:{ type: String},
                },
                impottype7: {

                        type:{ type: String},
                        chiffreaffaireht:{ type: String},
                        montantcontribution:{ type: String},
                        }
});


module.exports = mongoose.model('Decfiscmens', decfiscmensSchema);