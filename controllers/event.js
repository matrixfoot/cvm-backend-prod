const Event = require('../models/fiscal-events');
const mongoose = require('mongoose');

/* Fetch all events */
exports.getEvents = async (req, res, next) => {
  await Event.find().then(
    (events) => {
      res.status(200).json(events);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.getcomingEvents =  (req, res, next) => {
  
   Event.find({'date':{ $gte:Date.now()}}).sort({ 'date': 1 }).limit(6).then(
    (events) => {
      res.status(200).json(events);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
/* Create new event */
exports.createEvent = (req, res, next) => {
    const { title, date } = req.body;

    const newEvent = new Event({ title, date })

    try {
         newEvent.save();
        res.status(201).json(
            {
              data: newEvent,
                type: "succès",
                message: "Evenement créé"
            }
        );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

/* Delete singile event */
exports.deleteEvent = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`Evènement introuvable avec cet identifiant: ${id}`);

     Event.findByIdAndRemove(id);

    res.json({ message: "Evènement supprimé avec succès" });
}

exports.geteventbyid = (req, res, next) => {
    Event.findOne({
      _id: req.params.id
    }).then(
      (event) => {
        res.status(200).json(event);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  }
  
exports.updateEvent =async  (req, res, next) => {
 
    try {
        
        
        const eventObject = req.file ?
          {
            ...JSON.parse(req.body.event),
            ficheUrl: `${req.file.url}`
          } : { ...req.body };
        const _id = req.params.id;
        const event =  await Event.findById(_id);
        
        await Event.findByIdAndUpdate(_id, { ...eventObject});
            
        event.updated = Date.now();
         await event.save().
        then (()=> res.status(200).json({
          data: event,
          message: 'Evénement modifié !'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
        
      } catch (error) {
        res.status(404).json({ error });
      }
  }





 
