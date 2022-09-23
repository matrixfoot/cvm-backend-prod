const Decfiscmens = require('../models/dec-fisc-mens');
const User = require('../models/user');

const sendEmail = require('../send-email');









  exports.createdecfiscmens = async (req, res, next) => {
    
    const origin =req.get('origin');
     
    const newDecfiscmens = new Decfiscmens({...req.body});
    const {userId} = req.body
    const user = await User.findById(userId);
    
     (newDecfiscmens.save(),sendconfirmemail(user.email, origin)).
      then (()=>res.status(200).json({
        data: newDecfiscmens,
        message: "Votre déclaration a été crée avec succès"
      }))
      
      .catch(error => res.status(400).json({ error }));
 
  
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
exports.getdecfiscmensbyid = (req, res, next) => {
  Decfiscmens.findOne({
    _id: req.params.id
  }).then(
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
exports.getdecfiscmens = (req, res, next) => {
  const {userId} = req.body
  Decfiscmens.find({ userId}).then(
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
      const {userId} = req.body
      const user = await User.findById(userId);
    const _id = req.params.id;
    const decfiscmens = await Decfiscmens.findById(_id);
    
        await Decfiscmens.findByIdAndUpdate(_id, { ...decfiscmensObject});
        
    decfiscmens.updated = Date.now();
    await (decfiscmens.save(),sendupdateemail(user.email, origin)).
    then (()=> res.status(200).json({
      data: decfiscmens,
      message: 'déclaration modifée!'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    
  } catch (error) {
    res.status(404).json({ error });
  }
}


  async function sendupdateemail(sendemail, origin) {
    let message;
    if (origin) {
        const updatedecfiscmensUrl = `${origin}`;
        message = `<p>votre déclaration a été crée, veuillez nous rendre visite pour statut de votre déclaration</p>
                   <p><a href="${updatedecfiscmensUrl}">${updatedecfiscmensUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'Suivi de votre déclaration',
        html: `<h4>Suivi déclaration</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
  async function sendconfirmemail(sendemail, origin) {
    let message;
    if (origin) {
        const verifydecfiscmensUrl = `${origin}`;
        message = `<p>votre déclaration a été crée avec succès, veuillez rester à l'écoute nous vous informons dès le traitement de votre déclaration</p>
                   <p><a href="${verifydecfiscmensUrl}">${verifydecfiscmensUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'Verification de la réception de la déclaration',
        html: `<h4>Vérification déclaration</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
 
