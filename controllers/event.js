const Event = require('../models/fiscal-events');


/* Fetch all events */
exports.getEvents = (req, res, next) => {
    try {
        const events =  Event.find();

        res.status(200).json(events);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

/* Create new event */
exports.createEvent = (req, res, next) => {
    const { title, date } = req.body;

    const newEvent = new Event({ title, date })

    try {
         newEvent.save();
        res.status(201).json(
            {
                type: "success",
                message: "Event has been added successfully"
            }
        );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

/* Delete singile event */
exports.deleteEvent = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No event with id: ${id}`);

     Event.findByIdAndRemove(id);

    res.json({ message: "Event deleted successfully." });
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
  
exports.updateEvent =  (req, res, next) => {
 
    try {
        
        
        const eventObject = req.file ?
          {
            ...JSON.parse(req.body.event),
            ficheUrl: `${req.file.url}`
          } : { ...req.body };
        const _id = req.params.id;
        const event =  Event.findById(_id);
        
             Event.findByIdAndUpdate(_id, { ...eventObject});
            
        event.updated = Date.now();
         (event.save()).
        then (()=> res.status(200).json({
          data: event,
          message: 'Evénement modifié !'
        }))
        .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
        
      } catch (error) {
        res.status(404).json({ error });
      }
  }





 
