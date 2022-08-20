const Contact = require('../models/contact-req');
const config = require('../config.json');

const sendEmail = require('../send-email');

const fs = require('fs');






exports.createcontactreq = (req, res, next) => {
    
      const origin =req.get('origin');
      const contactObject= JSON.parse(req.body.contact);
      const newContact = new Contact({...contactObject,
        ficheUrl:`${req.file.url}`});
      
      
      
      (newContact.save(),sendconfirmemail(newContact, origin)).
      then (()=>res.status(200).json({
        data: newContact,
        message: "Votre requête a été crée avec succès"
      }))
      .catch(error => res.status(400).json({ error }));
   
    
  }
  exports.createcontactreqwithoutimage = (req, res, next) => {
    
    const origin =req.get('origin');
     
    const newContact = new Contact({...req.body});
    
    
    
    (newContact.save(),sendconfirmemail(newContact, origin)).
    then (()=>res.status(200).json({
      data: newContact,
      message: "Votre requête a été crée avec succès"
    }))
    .catch(error => res.status(400).json({ error }));
 
  
}






exports.getContactreqs = (req, res, next) => {
  Contact.find().then(
    (contacts) => {
      res.status(200).json(contacts);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.getcontactbyid = (req, res, next) => {
  Contact.findOne({
    _id: req.params.id
  }).then(
    (contact) => {
      res.status(200).json(contact);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getContactreqsup = (req, res, next) => {
  const {date} = req.body;
  Contact.find({'created': { $gte: date}}).then(
    (contact) => {
      res.status(200).json(contact);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getContactreqinf = (req, res, next) => {
    const {date} = req.body;
    Contact.find({'created': { $lte: date}}).then(
      (contact) => {
        res.status(200).json(contact);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

exports.updateContact = async (req, res, next) => {
 
  try {
    const origin =req.get('origin');
    
    const contactObject = req.file ?
      {
        ...JSON.parse(req.body.contact),
        ficheUrl: `${req.file.url}`
      } : { ...req.body };
    const _id = req.params.id;
    const contact = await Contact.findById(_id);
    
        await Contact.findByIdAndUpdate(_id, { ...contactObject});
        
    contact.updated = Date.now();
    await (contact.save(),sendupdateemail(contact, origin)).
    then (()=> res.status(200).json({
      data: contact,
      message: 'Requête traitée!'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    
  } catch (error) {
    res.status(404).json({ error });
  }
}


  async function sendupdateemail(contact, origin) {
    let message;
    if (origin) {
        const updatecontactUrl = `${origin}`;
        message = `<p>votre réclamation a été traitée, veuillez nous rendre visite pour découvrir le résultat suite à  votre requête</p>
                   <p><a href="${updatecontactUrl}">${updatecontactUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: contact.email,
        subject: 'Suivi de votre requête',
        html: `<h4>Suivi requête</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
  async function sendconfirmemail(newContact, origin) {
    let message;
    if (origin) {
        const verifycontactUrl = `${origin}`;
        message = `<p>votre requête a été envoyé avec succès, veuillez rester à l'écoute nous vous informons dès le traitement de votre requête</p>
                   <p><a href="${verifycontactUrl}">${verifycontactUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: newContact.email,
        subject: 'Verification de réception de réclamation',
        html: `<h4>Vérification réclamation</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
 
