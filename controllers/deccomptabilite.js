const Deccomptabilite = require('../models/dec-comptabilite');
const User = require('../models/user');

const sendEmail = require('../send-email');









  exports.createdeccomptabilite = async (req, res, next) => {

    const origin =req.get('origin');
    const deccomptabiliteObject= JSON.parse(req.body.deccomptabilite);
    let autre1 = deccomptabiliteObject.autre1
    let autre2 = deccomptabiliteObject.autre2
    let autre4 = deccomptabiliteObject.autre4
    let autre3 = deccomptabiliteObject.autre3
    let autre3filtred=filterByValue(deccomptabiliteObject.autre3,'true')
    let autre5filtred=filterByValue(deccomptabiliteObject.autre5,'true')
    let autre6filtred=filterByValue(deccomptabiliteObject.autre6,'true')
console.log(req.files)
    let files3= filterByValue(req.files, 't3')
    autre3filtred.forEach((item, index) => { 
      if(filterByValue2(files3,'t3'+item.fournisseur+item.numerofacture+deccomptabiliteObject.mois+deccomptabiliteObject.annee))
      {
        item.ficheUrl= `${req.protocol}://${req.get('host')}/${files3[index].url}`;

      }
      else 
      {
        item.ficheUrl=''
      }

   })
   let autre5 = deccomptabiliteObject.autre5
   let files5= filterByValue(req.files, 't5')
   autre5filtred.forEach((key, number) => { 
      if(filterByValue2(files5, 't5'+key.annee+key.mois))
      {
        key.ficheUrl =`${req.protocol}://${req.get('host')}/${files5[number].url}`
      }
      else 
      {
        key.ficheUrl=''
      }
    })
      let autre6 = deccomptabiliteObject.autre6
      let files6= filterByValue(req.files, 't6')
      autre6filtred.forEach((item, index) => { 
        if(filterByValue2(files6,'t6'+item.matricule+deccomptabiliteObject.mois+deccomptabiliteObject.annee))
        {
          item.ficheUrl =`${req.protocol}://${req.get('host')}/${files6[index].url}`
        }
        else 
        {
          item.ficheUrl=''
        }
  
     }) 
   const newDeccomptabilite = new Deccomptabilite({...deccomptabiliteObject,
    autre3,autre5,autre6,autre1,autre2,autre4 }); 
   
    const {userId} = deccomptabiliteObject.userId
    const{mois}=deccomptabiliteObject.mois
    const{annee}=deccomptabiliteObject.mois
    Deccomptabilite.find({userId,annee,mois}).then(
      (deccomptabilite) => {
        if (deccomptabilite.length>0) {
    
          return (res.status(300).json({ error: 'd??claration pour ce mois et cette ann??e existe d??j??! vous pouvez par ailleurs la modifier ?? travers votre tableau de bord' }),console.log(deccomptabilite))
          
        } 
      }
    )
   
    const user = await User.findById(userId);
     (newDeccomptabilite.save()).
      then (()=>res.status(200).json({
        data: newDeccomptabilite,
        message: "Votre fichier comptable a ??t?? cr??e avec succ??s"
      }))
      
      .catch(error => res.status(404).json({ error }));
 
  
}






exports.getDeccomptabilite = (req, res, next) => {
    Deccomptabilite.find().then(
    (deccomptabilite) => {
      res.status(200).json(deccomptabilite);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.deletedeccomptabilite = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deccomptabilite = await Deccomptabilite.findById(id);
    if (res.locals.loggedInUser._id != deccomptabilite.userId&&req.user.role!='admin'&&req.user.role!='supervisor')
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'??x??cuter cette action'})
  }
    if (!deccomptabilite) return res.status(401).json({ error: 'fichier comptable non trouv?? !' });
    await Deccomptabilite.findByIdAndDelete(id);

    res.status(200).json({
      data: null,
      message: 'd??claration supprim?? avec succ??s'
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
exports.deletedeccomptabilites = async (req, res, next) => {
  try {
    
    await Deccomptabilite.deleteMany();

    res.status(200).json({
      data: null,
      message: 'tous les fichiers comptables sont supprim??s avec succ??s'
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
exports.getdeccomptabilitebyid = (req, res, next) => {
    Deccomptabilite.findOne({
    _id: req.params.id
  }).then(
    (deccomptabilite) => {
      if (res.locals.loggedInUser._id != deccomptabilite.userId&&req.user.role!='admin'&&req.user.role!='supervisor')
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'??x??cuter cette action'})
  }
      res.status(200).json(deccomptabilite);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getdeccomptabilite = (req, res, next) => {
  const {userId} = req.body
  Deccomptabilite.find({userId}).then(
    (deccomptabilite) => {
      res.status(200).json(deccomptabilite);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getdeccomptabilitemoisannee = (req, res, next) => {
  const {userId,annee,mois} = req.body
  Deccomptabilite.find({userId,annee,mois}).then(
    (deccomptabilite) => {
      res.status(200).json(deccomptabilite);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.updatedeccomptabilite = async (req, res, next) => {
 
  
    const origin =req.get('origin');
    const deccomptabiliteObject= JSON.parse(req.body.deccomptabilite);
    let autre1 = deccomptabiliteObject.autre1
    let autre2 = deccomptabiliteObject.autre2
    let autre4 = deccomptabiliteObject.autre4
    let autre3 = deccomptabiliteObject.autre3
    let autre5 = deccomptabiliteObject.autre5
    let autre6 = deccomptabiliteObject.autre6

    let autre3filtred=filterByValue(deccomptabiliteObject.autre3,'true')
    let autre5filtred=filterByValue(deccomptabiliteObject.autre5,'true')
    let autre6filtred=filterByValue(deccomptabiliteObject.autre6,'true')

    let files3= filterByValue(req.files, 't3')
    autre3filtred.forEach((item, index) => { 
      if(filterByValue2(files3,'t3'+item.fournisseur+item.numerofacture+deccomptabiliteObject.mois+deccomptabiliteObject.annee))
      {
        item.ficheUrl= `${req.protocol}://${req.get('host')}/${files3[index].url}`;

      }
      else 
      {
        item.ficheUrl=''
      }

   })
   let files5= filterByValue(req.files, 't5')
   autre5filtred.forEach((key, number) => { 
      if(filterByValue2(files5, 't5'+key.annee+key.mois))
      {
        key.ficheUrl =`${req.protocol}://${req.get('host')}/${files5[number].url}`
      }
      else 
      {
        key.ficheUrl=''
      }
    })
      let files6= filterByValue(req.files, 't6')
      autre6filtred.forEach((item, index) => { 
        if(filterByValue2(files6,'t6'+item.matricule+deccomptabiliteObject.mois+deccomptabiliteObject.annee))
        {
          item.ficheUrl =`${req.protocol}://${req.get('host')}/${files6[index].url}`
        }
        else 
        {
          item.ficheUrl=''
        }
  
     })
    
     
    const _id = req.params.id;
    const deccomptabilite = await Deccomptabilite.findById(_id);
    
    const user = await User.findById(deccomptabilite.userId);
    if (res.locals.loggedInUser._id != deccomptabilite.userId&&req.user.role!='admin'&&req.user.role!='supervisor')
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'??x??cuter cette action'})
  }
        await Deccomptabilite.findByIdAndUpdate(_id, { ...deccomptabiliteObject});
        
    deccomptabilite.updated = Date.now();
    await (deccomptabilite.save()).
    then (()=> res.status(200).json({
      data: deccomptabilite,
      message: 'd??claration modif??e!'
    }))
    .catch(error => res.status(400).json({ error , message: 'op??ration non aboutie veuillez r??essayer'}));
  
  
} 
exports.completedeccomptabilite = async (req, res, next) => {
 
  try {
    const origin =req.get('origin');
    
    const deccomptabiliteObject = req.file ?
      {
        ...JSON.parse(req.body.deccomptabilite), 
        ficheUrl: `${req.file.url}`
      } : { ...req.body }; 
     
    const _id = req.params.id;
    const deccomptabilite = await Deccomptabilite.findById(_id);
    
    const user = await User.findById(deccomptabilite.userId);
    if (res.locals.loggedInUser._id != deccomptabilite.userId&&req.user.role!='admin'&&req.user.role!='supervisor')
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'??x??cuter cette action'})
  }
        await Deccomptabilite.findByIdAndUpdate(_id, { ...deccomptabiliteObject});
        
    deccomptabilite.updated = Date.now();
    await (deccomptabilite.save(),sendupdateemail(user.email, origin)).
    then (()=> res.status(200).json({
      data: deccomptabilite,
      message: 'd??claration modif??e!'
    }))
    .catch(error => res.status(400).json({ error , message: 'op??ration non aboutie veuillez r??essayer'}));
  }
  catch (error) {
    res.status(404).json({ error });
  } 
  
}
function filterByValue(array, value) {
  if(array!=undefined)
  {
    return array.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
}
function filterByValue2(array, value) {
  return array.find((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
}
  async function sendupdateemail(sendemail, origin) {
    let message;
    if (origin) {
        const updatedeccomptabiliteUrl = `${origin}/user-board`;
        message = `<p>le statut de votre d??claration a ??t?? modifi??, veuillez nous rendre visite pour consulter le statut de votre fichier comptable</p>
                   <p><a href="${updatedeccomptabiliteUrl}">${updatedeccomptabiliteUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour d??bloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'Suivi de votre fichier comptable',
        html: `<h4>Suivi fichier comptable</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
  async function sendconfirmemail(sendemail, origin) {
    let message;
    if (origin) {
        const verifydeccomptabiliteUrl = `${origin}/user-board`;
        message = `<p>votre fichier comptable a ??t?? cr??e avec succ??s, veuillez rester ?? l'??coute nous vous informons d??s le traitement de votre fichier</p>
                   <p><a href="${verifydeccomptabiliteUrl}">${verifydeccomptabiliteUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour d??bloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'Verification de la r??ception du fichier comptable',
        html: `<h4>V??rification fichier</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
 