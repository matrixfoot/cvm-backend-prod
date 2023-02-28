const Carousel = require('../models/settings');
const config = require('../config.json');

const sendEmail = require('../send-email');

const fs = require('fs');






exports.createcarouseldata = (req, res, next) => {
    
      const origin =req.get('origin');
      const carouselObject= JSON.parse(req.body.carousel);
      const newCarousel = new Carousel({...carouselObject,
        ficheUrl: `${req.protocol}://${req.get('host')}/fichiers/${req.file.filename}`});
      
      
      
      newCarousel.save().
      then (()=>res.status(200).json({
        data: newCarousel,
        message: "Votre actualité a été crée avec succès"
      }))
      .catch(error => res.status(400).json({ error }));
   
    
  }
 
  exports.createactualitewithoutimage = (req, res, next) => {
    
    const origin =req.get('origin');
     
    const newCarousel = new Carousel({...req.body});
    
    
    
    (newCarousel.save()).
    then (()=>res.status(200).json({
      data: newCarousel,
      message: "Votre actualité a été crée avec succès"
    }))
    .catch(error => res.status(400).json({ error }));
 
  
}





exports.getCarouselalldata = (req, res, next) => {
  Carousel.find().then(
    (alldata) => {
      res.status(200).json(alldata);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.getcarouseldatabyid = (req, res, next) => {
  Carousel.findOne({
    _id: req.params.id
  }).then(
    (data) => {
      res.status(200).json(data);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};



exports.updateCarouseldata = async (req, res, next) => {
 
  try {
    const origin =req.get('origin');
    
    const carouselObject = req.file ?
      {
        ...JSON.parse(req.body.carousel),
        ficheUrl: `${req.protocol}://${req.get('host')}/fichiers/${req.file.filename}`
      } : { ...req.body };
    const _id = req.params.id;
    const carousel = await Carousel.findById(_id);

        await Carousel.findByIdAndUpdate(_id, { ...carouselObject});
    
    carousel.updated = Date.now();
    await (carousel.save()).
    then (()=> res.status(200).json({
      data: carousel,
      message: 'Actualitée modifiée!'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    
  } catch (error) {
    res.status(404).json({ error });
  }
}
exports.deleteCarouseldata = async (req, res, next) => {
    try {
      const id = req.params.id;
      const carousel = await Carousel.findById(id);
      if (!carousel) return res.status(401).json({ error: 'Actualitée non trouvé !' });
      await Carousel.findByIdAndDelete(id);
  
      res.status(200).json({
        data: null,
        message: 'actualitée supprimée avec succès'
      });
    } catch (error) {
      res.status(400).json({ error });
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
 
