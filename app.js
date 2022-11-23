const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('./models/user');
const cors = require('cors');
const isJwtExpired =require ('jwt-check-expiration');
require ('dotenv').config();


const userRoutes = require('./routes/user');
const condidateRoutes = require('./routes/career-condidate');
const contactRoutes = require('./routes/contact-req');
const carouselRoutes = require('./routes/settings');
const eventRoutes = require('./routes/event');
const decfiscmensRoutes = require('./routes/dec-fisc-mens');
const deccomptabiliteRoutes = require('./routes/dec-comptabilite');

const app = express();

mongoose.connect('mongodb+srv://'+process.env.USERNAMEMONGO+':'+process.env.PASSWORDMONGO+process.env.URIMONGO,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization,x-access-token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(async (req, res, next) => {
    
    try{
    if (req.headers["x-access-token"]) {
      const accessToken = req.headers["x-access-token"];
      const { userId} = await jwt.verify(accessToken, 'RANDOM_TOKEN_SECRET');
      // Check if token has expired
      
      
      res.locals.loggedInUser = await User.findById(userId);
      
      next();
      
     } else {
      next();
      
     }}
     catch (error) {
      res.status(415).json({ error });
    }
  });


 app.use('/api/users', userRoutes);
 app.use('/api/condidates', condidateRoutes);
 app.use('/api/contactreqs', contactRoutes);
 app.use('/api/settings', carouselRoutes);
 app.use('/api/events', eventRoutes);
 app.use('/api/decfiscmens', decfiscmensRoutes);
 app.use('/api/deccomptabilite', deccomptabiliteRoutes);

 app.use(express.static(path.join(__dirname, 'images')));
  app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'cvcondidates'));
  })

module.exports = app;