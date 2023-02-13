const Contact = require('../models/contact-req');
const config = require('../config.json');

const sendEmail = require('../send-email');

const fs = require('fs');






exports.createcontactreq = (req, res, next) => {
    
      const origin =req.get('origin');
      const contactObject= JSON.parse(req.body.contact);
      const newContact = new Contact({...contactObject,
        ficheUrl:`${req.file.url}`});
      
      
      
      (newContact.save(),sendconfirmemail(newContact, origin),sendmodificationemail('tn.macompta@gmail.com',newContact.email,newContact._id, origin)).
      then (()=>res.status(200).json({
        data: newContact,
        message: "Votre requête a été crée avec succès"
      }))
      .catch(error => res.status(400).json({ error }));
   
    
  }
  exports.createcontactreqwithoutimage = (req, res, next) => {
    
    const origin =req.get('origin');
     
    const newContact = new Contact({...req.body});
    
    
    
    (newContact.save(),sendconfirmemail(newContact, origin),sendmodificationemail('tn.macompta@gmail.com',newContact.email,newContact._id, origin)).
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
    const updatedcontact = await Contact.findById(_id);    
    contact.updated = Date.now();
    if(contactObject.statutadmin.length>0)
    {
      if(contactObject.statutadmin[contactObject.statutadmin.length-1].statut=='clôturé')
      {
        await (contact.save(),sendupdateemail(contact, origin)).
        then (()=> res.status(200).json({
          data: updatedcontact,
          message: 'Requête traitée!'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      }
      else if(contactObject.statutadmin[contactObject.statutadmin.length-1].statut!='clôturé')
      {
        await (contact.save()).
        then (()=> res.status(200).json({
          data: updatedcontact,
          message: 'Requête traitée!'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      }
    }
    else 
      {
        await (contact.save()).
        then (()=> res.status(200).json({
          data: updatedcontact,
          message: 'Requête traitée!'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      }
    
  } catch (error) {
    res.status(404).json({ error });
  }
}


  async function sendupdateemail(contact, origin) {
    let message;
    if (origin) {
        const updatecontactUrl = `${origin}`;
        message = `<p>votre requête a été traitée, veuillez vous connecter pour en découvrir le sort</p>
                   <p><a href="${updatecontactUrl}">${updatecontactUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: contact.email,
        subject: 'Suivi de requête',
        html: `<p>>Merci pour l'intérêt que vous accordez au cabinet!</p>
               ${message}`
    });
  }
  async function sendconfirmemail(newContact, origin) {
    let message;
    if (origin) {
        const verifycontactUrl = `${origin}`;
        message = `<p>votre requête a été enregistrée avec succès, vous pouvez toujours vous connecter pour en savoir le sort</p>
                   <p><a href="${verifycontactUrl}">${verifycontactUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: newContact.email,
        subject: 'confirmation de réception de requête',
        html: `<p>>Merci pour l'intérêt que vous accordez au cabinet!</p>
               ${message}`
    });
  }
  async function sendmodificationemail(sendemail,email,id, origin) {
    let message;
    if (origin) {
        const verifydecfiscmensUrl = `${origin}/view-decfiscmens/${id}`;
        message = `<p>une requête a été déposée par ${email} avec succès, veuillez la consulter pour la traiter</p>
                   <p><a href="${verifydecfiscmensUrl}">${verifydecfiscmensUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact`}</code></p>`;
    }
  
    await sendEmail({
        to: sendemail,
        subject: 'réception de requête',
        html: `<p>>Merci pour l'intérêt que vous accordez au cabinet!</p>
               ${message}`
    });
  }
 
