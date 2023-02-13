const Decfiscmens = require('../models/dec-fisc-mens');
const user = require('../models/user');
const User = require('../models/user');

const sendEmail = require('../send-email');









  exports.createdecfiscmens = async (req, res, next) => {
    
    const origin =req.get('origin');
     
    const newDecfiscmens = new Decfiscmens({...req.body});
   
    const {userId} = req.body
    const{mois}=req.body.mois
    const{annee}=req.body.mois
    Decfiscmens.find({userId,annee,mois}).then(
      (decfiscmens) => {
        if (decfiscmens.length>0) {
    
          return (res.status(300).json({ error: 'déclaration pour ce mois et cette année existe déjà! vous pouvez par ailleurs la modifier à travers votre tableau de bord' }),console.log(decfiscmens))
          
        } 
      }
    )
   
    const user = await User.findById(userId);
  
     (newDecfiscmens.save(),sendconfirmemail(user.email, origin),sendcreationemail('tn.macompta@gmail.com',user.email,newDecfiscmens._id, origin)).
      then (()=>res.status(200).json({
        data: newDecfiscmens,
        message: "Votre déclaration a été crée avec succès"
      }))
      
      .catch(error => res.status(404).json({ error }));
 
  
}






exports.getDecfiscmens = (req, res, next) => {
  Decfiscmens.find().then(
    (decfiscmenss) => {
      res.status(200).json(decfiscmenss);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.deletedecfiscmens = async (req, res, next) => {
  try {
    const id = req.params.id;
    const decfismens = await Decfiscmens.findById(id);
    if (!decfismens) return res.status(401).json({ error: 'déclaration non trouvé !' });
    await Decfiscmens.findByIdAndDelete(id);

    res.status(200).json({
      data: null,
      message: 'déclaration supprimé avec succès'
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
exports.deletedecfiscmenss = async (req, res, next) => {
  try {
    
    await Decfiscmens.deleteMany();

    res.status(200).json({
      data: null,
      message: 'toutes les déclarations sont supprimés avec succès'
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
exports.getdecfiscmensbyid = (req, res, next) => {
  
  Decfiscmens.findOne({
    _id: req.params.id
  }).then(
    (decfiscmens) => {
      console.log(req.user.role)
      if (res.locals.loggedInUser._id != decfiscmens.userId&&req.user.role!='admin'&&req.user.role!='supervisor')
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'})
  }
      res.status(200).json(decfiscmens);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
  
};
exports.getdecfiscmens = (req, res, next) => {
  const {userId} = req.body
  Decfiscmens.find({userId}).then(
    (decfiscmens) => {
      res.status(200).json(decfiscmens);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getdecfiscmensmoisannee = (req, res, next) => {
  const {userId,annee,mois} = req.body
  Decfiscmens.find({userId,annee,mois}).then(
    (decfiscmens) => {
      res.status(200).json(decfiscmens);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.updatedecfiscmens = async (req, res, next) => {
 
  try {
    const origin =req.get('origin');
    
    const decfiscmensObject = req.file ?
      {
        ...JSON.parse(req.body.decfiscmens), 
        ficheUrl: `${req.file.url}`
      } : { ...req.body };
     
    const _id = req.params.id;
    const decfiscmens = await Decfiscmens.findById(_id);
    
    const user = await User.findById(decfiscmens.userId);
        await Decfiscmens.findByIdAndUpdate(_id, { ...decfiscmensObject});
        const updateddecfiscmens = await Decfiscmens.findById(_id);    
    decfiscmens.updated = Date.now();
    if(decfiscmensObject.statutadmin.length>0)
    {
      if(decfiscmensObject.statutadmin[decfiscmensObject.statutadmin.length-1].statut=='clôturé')
      {
        await (decfiscmens.save(),sendupdateemail(user.email, origin),sendmodificationemailadmin('tn.macompta@gmail.com',user.email,decfiscmens._id, origin)).
        then (()=> res.status(200).json({
          data: updateddecfiscmens,
          message: 'déclaration modifée!'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      }
      else if(decfiscmensObject.statutadmin[decfiscmensObject.statutadmin.length-1].statut!='clôturé')
      {
        await (decfiscmens.save(),sendmodificationemailadmin('tn.macompta@gmail.com',user.email,decfiscmens._id, origin)).
        then (()=> res.status(200).json({
          data: updateddecfiscmens,
          message: 'déclaration modifée!'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      }
    }
    else
    {
      await (decfiscmens.save(),sendmodificationemailadmin('tn.macompta@gmail.com',user.email,decfiscmens._id, origin)).
        then (()=> res.status(200).json({
          data: updateddecfiscmens,
          message: 'déclaration modifée!'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    }
  }
  catch (error) {
    res.status(404).json({ error });
  } 
  
}
exports.completedecfiscmens = async (req, res, next) => {
 
  try {
    const origin =req.get('origin');
    
    const decfiscmensObject = req.file ?
      {
        ...JSON.parse(req.body.decfiscmens), 
        ficheUrl: `${req.file.url}`
      } : { ...req.body };
     
    const _id = req.params.id;
    const decfiscmens = await Decfiscmens.findById(_id);
    
    const user = await User.findById(decfiscmens.userId);
    if (res.locals.loggedInUser._id != decfiscmens.userId&&req.user.role!='admin'&&req.user.role!='supervisor')
  {
return res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'})
  }
        await Decfiscmens.findByIdAndUpdate(_id, { ...decfiscmensObject});
        
    decfiscmens.updated = Date.now();
    await (decfiscmens.save(),sendupdateemail(user.email, origin),sendmodificationemail('tn.macompta@gmail.com',user.email,decfiscmens._id, origin)).
    then (()=> res.status(200).json({
      data: decfiscmens,
      message: 'déclaration modifée!'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
  }
  catch (error) {
    res.status(404).json({ error });
  } 
  
}


  async function sendupdateemail(sendemail, origin) {
    let message;
    if (origin) {
        const updatedecfiscmensUrl = `${origin}/user-board`;
        message = `<p>Vos données de déclaration ont été définitivement traitées, veuillez vous connecter pour l'éditer</p>
                   <p><a href="${updatedecfiscmensUrl}">${updatedecfiscmensUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'Fin de traitement de votre déclaration',
        html: `<p>>Merci pour l'intérêt que vous accordez au cabinet!</p>
               ${message}`
    });
  }
 
  async function sendconfirmemail(sendemail, origin) {
    let message;
    if (origin) {
        const verifydecfiscmensUrl = `${origin}/user-board`;
        message = `<p>vos données de déclaration ont été reçues avec succès, vous pouvez toujours vous connecter pour en savoir le sort. nous vous informerons dès que votre déclaration sera définitivement contrôlée</p>
                   <p><a href="${verifydecfiscmensUrl}">${verifydecfiscmensUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'confirmation de la réception des données de déclaration',
        html: `<p>>Merci pour l'intérêt que vous accordez au cabinet!</p>
               ${message}`
    });
  }
  async function sendcreationemail(sendemail,email,id, origin) {
    let message;
    if (origin) {
        const verifydecfiscmensUrl = `${origin}/view-decfiscmens/${id}`;
        message = `<p>une déclaration a été crée par ${email} avec succès, veuillez la consulter pour traitement</p>
                   <p><a href="${verifydecfiscmensUrl}">${verifydecfiscmensUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'réception des données de déclaration',
        html: `<p>>Merci pour l'intérêt que vous accordez au cabinet!</p>
               ${message}`
    });
  }
  async function sendmodificationemailadmin(sendemail,email,id, origin) {
    let message;
    if (origin) {
        const verifydecfiscmensUrl = `${origin}/view-decfiscmens/${id}`;
        message = `<p>une déclaration a été complétée par ${email} avec succès, veuillez la consulter pour décider le sort de la déclaration</p>
                   <p><a href="${verifydecfiscmensUrl}">${verifydecfiscmensUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'évaluation de la déclaration',
        html: `<h4>évaluation de la déclaration</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
