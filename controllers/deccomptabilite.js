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
    let files3= filterByValue(req.files, 't3')
    autre3.forEach((item, index) => { 
      if(filterByValue2(files3,'t3'+item.numerofacture+deccomptabiliteObject.mois+deccomptabiliteObject.annee))
      {
        item.ficheUrl =`${files3[index].url}` 
      }
      else 
      {
        item.ficheUrl=''
      }
      console.log(`'t3${item.numerofacture+deccomptabiliteObject.mois+deccomptabiliteObject.annee}'`)

   })
   let autre5 = deccomptabiliteObject.autre5
   let files5= filterByValue(req.files, 't5')
    autre5.forEach((key, number) => { 
      if(filterByValue2(files5, 't5'+key.annee+key.mois))
      {
        key.ficheUrl =`${files5[number].url}` 
      }
      else 
      {
        key.ficheUrl=''
      }   
    })
      let autre6 = deccomptabiliteObject.autre6
      let files6= filterByValue(req.files, 't6')
      autre6.forEach((item, index) => { 
        if(filterByValue2(files6,'t6'+item.matricule+deccomptabiliteObject.mois+deccomptabiliteObject.annee))
        {
          item.ficheUrl =`${files6[index].url}` 
        }
        else 
        {
          item.ficheUrl=''
        }
        console.log(`'t6${item.matricule+deccomptabiliteObject.mois+deccomptabiliteObject.annee}'`)
  
     })
   const newDeccomptabilite = new Deccomptabilite({...deccomptabiliteObject,
    autre3,autre5,autre6,autre1,autre2,autre4 }); 
   
    const {userId} = req.body 
    
    const user = await User.findById(userId);
   
     (newDeccomptabilite.save()).
      then (()=>res.status(200).json({
        data: newDeccomptabilite,
        message: "Votre fichier comptable a été crée avec succès"
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
    if (res.locals.loggedInUser._id != deccomptabilite.userId)
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'})
  }
    if (!deccomptabilite) return res.status(401).json({ error: 'fichier comptable non trouvé !' });
    await Deccomptabilite.findByIdAndDelete(id);

    res.status(200).json({
      data: null,
      message: 'déclaration supprimé avec succès'
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
      message: 'tous les fichiers comptables sont supprimés avec succès'
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
      if (res.locals.loggedInUser._id != deccomptabilite.userId)
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'})
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
    if (res.locals.loggedInUser._id != deccomptabilite.userId)
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'})
  }
        await Deccomptabilite.findByIdAndUpdate(_id, { ...deccomptabiliteObject});
        
    deccomptabilite.updated = Date.now();
    await (deccomptabilite.save(),sendupdateemail(user.email, origin)).
    then (()=> res.status(200).json({
      data: deccomptabilite,
      message: 'déclaration modifée!'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
  }
  catch (error) {
    res.status(404).json({ error });
  } 
  
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
    if (res.locals.loggedInUser._id != deccomptabilite.userId)
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'})
  }
        await Deccomptabilite.findByIdAndUpdate(_id, { ...deccomptabiliteObject});
        
    deccomptabilite.updated = Date.now();
    await (deccomptabilite.save(),sendupdateemail(user.email, origin)).
    then (()=> res.status(200).json({
      data: deccomptabilite,
      message: 'déclaration modifée!'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
  }
  catch (error) {
    res.status(404).json({ error });
  } 
  
}
function filterByValue(array, value) {
  return array.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
}
function filterByValue2(array, value) {
  return array.find((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
}
  async function sendupdateemail(sendemail, origin) {
    let message;
    if (origin) {
        const updatedeccomptabiliteUrl = `${origin}/user-board`;
        message = `<p>le statut de votre déclaration a été modifié, veuillez nous rendre visite pour consulter le statut de votre fichier comptable</p>
                   <p><a href="${updatedeccomptabiliteUrl}">${updatedeccomptabiliteUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
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
        message = `<p>votre fichier comptable a été crée avec succès, veuillez rester à l'écoute nous vous informons dès le traitement de votre fichier</p>
                   <p><a href="${verifydeccomptabiliteUrl}">${verifydeccomptabiliteUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'Verification de la réception du fichier comptable',
        html: `<h4>Vérification fichier</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
 
