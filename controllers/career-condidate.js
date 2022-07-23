const Condidate = require('../models/career-condidate');
const config = require('../config.json');

const sendEmail = require('../send-email');

const fs = require('fs');






exports.createcondidate = async (req, res, next) => {
    try {
      const origin =req.get('origin');
      const condidateObject= JSON.parse(req.body.condidate);
      const newCondidate = new Condidate({...condidateObject,
        ficheUrl: `${req.file.url}`});
      
      
      
      await (newCondidate.save(),sendconfirmemail(newCondidate, origin));
      res.json({
        data: newCondidate,
        message: "Votre demande a été crée avec succès"
      })
    } catch (error) {
      res.status(31).json({ error });
    }
   
    
  }






exports.getCondidates = (req, res, next) => {
  Condidate.find().then(
    (condidates) => {
      res.status(200).json(condidates);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getCondidate = (req, res, next) => {
  const {email} = req.body
  Condidate.find({ email}).then(
    (condidate) => {
      res.status(200).json(condidate);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.filtercondidatechoice = async (req, res, next) => {
  const {email,firstname,lastname,mobile,decision} = req.body;
  
  
  await 
  Condidate.find({$or:[{email},{firstname},{mobile},{lastname},{decision}]}).then(
    (condidates) => {
      res.status(200).json(condidates);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.updateCondidate = async (req, res, next) => {
 
  try {
    const origin =req.get('origin');
    
    const condidateObject = req.file ?
      {
        ...JSON.parse(req.body.condidate),
        ficheUrl: `${req.file.url}`
      } : { ...req.body };
    const _id = req.params.id;
    const condidate = await Condidate.findById(_id);
    
        await Condidate.findByIdAndUpdate(_id, { ...condidateObject});
        
    condidate.updated = Date.now();
    await condidate.save();
    res.status(200).json({
      data: condidate,
      message: 'Candidature modifié !'
    });
  } catch (error) {
    res.status(404).json({ error });
  }
}

exports.deletecondidate = async (req, res, next) => {
    try {
      const id = req.params.id;
      const condidate = await Condidate.findById(id);
      if (!condidate) return res.status(401).json({ error: 'Demande non trouvé !' });
      await Condidate.findByIdAndDelete(id);

      res.status(200).json({
        data: null,
        message: 'demande supprimée avec succès'
      });
    } catch (error) {
      res.status(36).json({ error });
    }
  }
  async function sendconfirmemail(newCondidate, origin) {
    let message;
    if (origin) {
        const verifycondidateUrl = `${origin}/login`;
        message = `<p>votre demande a été enregistré, veuillez vous inscrire/se connecter pour suivre votre candidature</p>
                   <p><a href="${verifycondidateUrl}">${verifycondidateUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: newCondidate.email,
        subject: 'Verification de réception de candidature',
        html: `<h4>Vérification candidature</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
 

