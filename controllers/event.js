const Event = require('../models/fiscal-events');


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
  
   Event.find({'date':{ $gte:Date.now() - 24*60*60*1000}}).sort({ 'date': 1 }).limit(6).then(
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
exports.createEvent = async (req, res, next) => {
    const { title, date,description } = req.body;

    const newEvent = new Event({ title, date,description })

    try {
      if (await Event.findOne({ title: req.body.title }) &&await Event.findOne({ date: req.body.date })) {
    
    return await (res.status(300).json({ error: 'évènement avec ce nom et prévu pour cette date existe déjà!' }))
    
    
}
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

/*insert many events*/
exports.createmultipleEvent = async (req, res, next) => {
  try {
let newevents= req.body
  //const newEvent = new Event({ title, date,description })
 
  
newevents.forEach((item, index) => {
item.title=`${newevents[index].title}`
item.date=`${newevents[index].date}`
item.description=`${newevents[index].description}`
const newEvent = new Event({title:item.title,date:item.date,description:item.description});
console.log(newEvent)
newEvent.save();
   })
  res.status(201).json(
    {
      data: newevents,
        type: "succès",
        message: "Evenements créés"
    }
);
} catch (error) {
  res.status(409).json({ message: error.message });
}
}

/* Delete singile event */
exports.deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id);
    if (!event) return res.status(401).json({ error: 'Demande non trouvé !' });
    await Event.findByIdAndDelete(id);

    res.status(200).json({
      data: null,
      message: 'évènement supprimée avec succès'
    });
  } catch (error) {
    res.status(400).json({ error });
  }
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
  exports.deleteevents = async (req, res, next) => {
    try {
      
      await Event.deleteMany();
  
      res.status(200).json({
        data: null,
        message: 'toutes les évènements sont supprimés avec succès'
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }




 
