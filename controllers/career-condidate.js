const Condidate = require('../models/career-condidate');
const config = require('../config.json');

const sendEmail = require('../send-email');

const fs = require('fs');






exports.createcondidate = (req, res, next) => {
    
      const origin =req.get('origin');
      const condidateObject= JSON.parse(req.body.condidate);
      const newCondidate = new Condidate({...condidateObject,
        /*ficheUrl: `${req.protocol}://www.macompta.com.tn/${req.file.path}`});*/
        ficheUrl: `${req.protocol}://${req.get('host')}/fichiers/${req.file.filename}`});
      
      
      (newCondidate.save(),sendconfirmemail(newCondidate, origin),sendcreationemail('tn.macompta@gmail.com',newCondidate.email,newCondidate._id, origin)).
      then (()=>res.status(201).json({
        data: newCondidate,
        message: "Votre demande a été crée avec succès"
      }))
      .catch(error => res.status(400).json({ error }));
   
    
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
exports.getcondidatebyid = (req, res, next) => {
  Condidate.findOne({
    _id: req.params.id
  }).then(
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
 
  
    const origin =req.get('origin');
    
    const condidateObject = req.file ?
      {
        ...JSON.parse(req.body.condidate),
        ficheUrl: `${req.protocol}://${req.get('host')}/fichiers/${req.file.filename}`
      } : { ...req.body };
    const _id = req.params.id;
    const condidate = await Condidate.findById(_id);
    
        await Condidate.findByIdAndUpdate(_id, { ...condidateObject});
    const condidateupdated = await Condidate.findById(_id);
    
    condidate.updated = Date.now();
    console.log(condidateObject.statutadmin.length)
    if(condidateObject.statutadmin.length>0)
    {
      console.log(condidateObject.statutadmin[condidateObject.statutadmin.length-1].statut)
      if(condidateObject.statutadmin[condidateObject.statutadmin.length-1].statut=='clôturé')
      {
        console.log('clot')
        await (condidate.save()).
        then (()=> res.status(200).json({
          data: condidateupdated,
          message: 'Candidature modifié !'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      }
      else if(condidateObject.statutadmin[condidateObject.statutadmin.length-1].statut!='clôturé')
      {
        console.log('autreclot')
        await (condidate.save()).
        then (()=> res.status(200).json({
          data: condidateupdated,
          message: 'Candidature modifié !'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      }
    }
    else 
      {
        console.log('here')

        await (condidate.save()).
        then (()=> res.status(200).json({
          data: condidateupdated,
          message: 'Candidature modifié !'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
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
      res.status(400).json({ error });
    }
  }
  exports.deletecondidates = async (req, res, next) => {
    try {
      
      await Condidate.deleteMany();
  
      res.status(200).json({
        data: null,
        message: 'toutes les candidatures sont supprimés avec succès'
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  } 
  async function sendupdateemail(condidate, origin) {
    let message;
    if (origin) {
        const updatecondidateUrl = `${origin}/login`;
        message = `<p>le statut de votre demande a été modifié, veuillez vous connecter pour en découvrir le sort</p>
                   <p><a href="${updatecondidateUrl}">${updatecondidateUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: condidate.email,
        subject: 'Suivi du sort  de candidature',
        html: `<h4>Suivi de candidature</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
  async function sendconfirmemail(newCondidate, origin) {
    let message;
    if (origin) {
        const verifycondidateUrl = `${origin}/login`;
        message = `<p>votre demande a été enregistrée, veuillez vous inscrire/se connecter pour suivre votre candidature</p>
                   <p><a href="${verifycondidateUrl}">${verifycondidateUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: newCondidate.email,
        subject: 'confirmation de réception de candidature',
        html: `<p>Merci pour l'intérêt que vous accordez au cabinet!</p>
               ${message}`
    });
  }
  async function sendcreationemail(sendemail,email,id, origin) {
    let message;
    if (origin) {
        const verifycondidateUrl = `${origin}/view-condidate/${id}`;
        message = `<p>une candidature a été déposée par ${email} avec succès, veuillez la consulter pour en décider le sort</p>
                   <p><a href="${verifycondidateUrl}">${verifycondidateUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'évaluation de candidature',
        html: `<h4>évaluation de candidature</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
  async function sendmodifadmin(sendemail,email,id, origin) {
    let message;
    if (origin) {
        const verifycondidateUrl = `${origin}/view-condidate/${id}`;
        message = `<p>une candidature de l'utilisateur ${email} a été modifiée suite à un traitement, veuillez la consulter pour en décider le sort</p>
                   <p><a href="${verifycondidateUrl}">${verifycondidateUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'évaluation de candidature',
        html: `<h4>évaluation de candidature</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }

