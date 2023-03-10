exports.getcurrenttime = (req, res, next) => { 
        res.status(200).json(Date.now());
  };