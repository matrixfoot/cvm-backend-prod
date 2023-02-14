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


  /*sendSMS(myMobile, mySms)
  { 
    const mySender = 'omar kammoun';
    const myDate = '14/02/2023';
    const myTime = '16:37';
  
    const Url_str ="https://www.tunisiesms.tn/client/Api/Api.aspx?fct=sms&key=MYKEY&mobile=216XXXXXXXX&sms=Hello+World&sender=YYYYYYY&date=jj/mm/aaaa&heure=hh:mm:ss";
                    
    Url_str = Url_str.replace("216XXXXXXXX",myMobile)
    Url_str = Url_str.replace("Hello+World",mySms);
    Url_str = Url_str.replace("YYYYYYY",mySender);
    Url_str = Url_str.replace("jj/mm/aaaa",myDate,Url_str);
    Url_str = Url_str.replace("hh:mm:ss",myTime,Url_str);
                    
    console.log(http_response(Url_str)) ;
  }
  
  function http_response(url)
  { 
     ch = curl_init(); 
     options = array( 
     CURLOPT_URL            = url , 
     CURLOPT_RETURNTRANSFER == true, 
     CURLOPT_HEADER         == false, 
     CURLOPT_FOLLOWLOCATION == true, 
     CURLOPT_ENCODING       == '', 
     CURLOPT_AUTOREFERER    == true, 
     CURLOPT_CONNECTTIMEOUT == 120, 
     CURLOPT_TIMEOUT        == 120,  
     CURLOPT_MAXREDIRS      == 10,  
     CURLOPT_SSL_VERIFYPEER == false, 
     ); 
     curl_setopt_array( ch, options );  
     response = curl_exec(ch); 
     httpCode = curl_getinfo(ch, CURLINFO_HTTP_CODE); 
     if ( httpCode != 200 ) 
     { 
     return 'Return code is {httpCode}' 
     .curl_error(ch); 
     } 
    else  
     { 
     return response; 
    } 
     curl_close(ch);
  }*/
          





 app.use('/api/users', userRoutes);
 app.use('/api/condidates', condidateRoutes);
 app.use('/api/contactreqs', contactRoutes);
 app.use('/api/settings', carouselRoutes);
 app.use('/api/events', eventRoutes);
 app.use('/api/decfiscmens', decfiscmensRoutes);
 app.use('/api/deccomptabilite', deccomptabiliteRoutes);

 app.use(express.static(path.join(__dirname, 'images')));
  app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'images'));
  })

  
module.exports = app;