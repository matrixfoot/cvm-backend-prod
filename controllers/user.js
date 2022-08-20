const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const crypto = require("crypto");
const sendEmail = require('../send-email');
const { roles } = require('../role')
const fs = require('fs');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next()
    } catch (error) {
      res.status(33).json({ error });
    }
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    res.status(32).json({ error });
  }
}


exports.signup = async (req, res, next) => {
  try {
    const origin =req.get('origin');
    const { email, password,confirmpassword, firstname,lastname,usertype,fonction,secteur,civilite,raisonsociale,mobile,nomsociete,clientcode,role} = req.body
    
    const hashedPassword = await hashPassword(password);
    const confirmedhashedPassword = await hashPassword(confirmpassword);
    
    const newUser = new User({email, password:hashedPassword,confirmpassword:confirmedhashedPassword,firstname,usertype,lastname,mobile,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role: role || "basic" });
    const accessToken = jwt.sign({ userId: newUser._id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: "1d"
    });
    if (await User.findOne({ email: req.body.email })) {
      // send already registered error in email to prevent account enumeration
      return await (sendAlreadyRegisteredEmail(email, origin)).
      then (()=> res.status(300).json({ error: 'utilisateur avec ce Mail existe déjà!' }))
      .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      
      
  }
  if (await User.findOne({ mobile: req.body.mobile })) {
    
    return await (res.status(300).json({ error: 'utilisateur avec ce Mobile existe déjà!' }))
    
    
}
  if (await req.body.password!==req.body.confirmpassword) return await (res.status(301).json({ error: 'Les mot de passes ne sont pas identiques!' }));
    newUser.accessToken = accessToken;
    
    await (newUser.save(),sendVerificationEmail(newUser, origin)).
    then (()=> res.json({
      data: newUser,
      message: "You have signed up successfully"
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    
   
  } catch (error) {
    res.status(31).json({ error });
  }
 
  
}


exports.verifyEmail= async (req, res, next) => {
  try {
  const {token}= req.body
  const user = await User.findOne({ accessToken:token});
   
  
  if (!user) throw 'vérification échouée';
  
  user.verified = Date.now();
  
  await user.save();
  res.json({
    message: 'Verification passée avec succès, vous pouvez maintenant vous connecter'
  })
}catch (error) {
  res.status(404).json({ error });
}
}

exports.forgotPassword= async (req, res, next) => {
try{
  const origin =req.get('origin');
  const {email}=req.body;
  const user = await User.findOne({ email });
  
  // always return ok response to prevent email enumeration
  if (!user) return await (res.status(350).json({ error: 'Cet utilisateur est inexsitant!' }));
  
  // create reset token that expires after 24 hours
  user.resetToken = {
      token: randomTokenString(),
      expires: new Date(Date.now() + 24*60*60*1000)
  };
  await user.save();

  // send email
  
  await sendPasswordResetEmail(user, origin).
  then (()=>res.json({ 
    message: 'Prière de consulter votre email pour appliquer les instructions' }))
  .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
  

}catch (error) {
  res.status(404).json({ error });
}
}
exports.validateResetToken= async (req, res, next) => {
  try{
  const {token}= req.body;
  const user = await User.findOne({
      'resetToken.token': token,
      'resetToken.expires': { $gt: Date.now() }
  });
  
  if (!user) throw 'Invalid token';
  res.json({ 
    message: 'Votre clé de réinitialisation est valide,si vous voulez modifier votre mot de passe copier la clé et cliquer sur réinitialiser mot de passe' })
}
catch (error) {
  res.status(404).json({ error });
}
}

exports.resetPassword= async (req, res, next) => {
try{
  const {token,password}= req.body;
  const user = await User.findOne({ 
      'resetToken.token': token,
      'resetToken.expires': { $gt: Date.now() }
  });
  
  if (!user) throw 'Invalid token';
  
  // update password and remove reset token
  user.password = await hashPassword(password);
  user.confirmpassword= await hashPassword(password);
  user.passwordReset =  Date.now();
  user.resetToken = undefined;
  await user.save();
  res.json({
     message: 'Votre mot de passe est maintenant réinitialisé, vous pouvez vous connecter' })
}catch (error) {
  res.status(454).json({ error });
}
}
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    if (!user.verified) return res.status(401).json({ error: 'Compte pas encore vérifié, veuillez cliquer sur le mail de vérification envoyé à votre adresse: !' });
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Mot de passe incorrect !' });
    const accessToken = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: "1d"
    });
    await User.findByIdAndUpdate(user._id, { accessToken })
    res.status(200).json({
       userId: user._id, email: user.email,password: user.password,confirmpassword: user.confirmpassword, role: user.role,
       acceptterms: user.acceptTerms, Firstname: user.firstname, Lastname: user.lastname, 
       fonction:user.fonction, secteur:user.secteur, civilite:user.civilite,usertype:user.usertype,mobile:user.mobile,
       raisonsociale:user.raisonsociale, nomsociete: user.nomsociete,natureactivite:user.natureactivite,
       activite:user.activite,
       sousactivite:user.sousactivite,
       regimefiscalimpot:user.regimefiscalimpot,
       regimefiscaltva:user.regimefiscaltva,
       matriculefiscale:user.matriculefiscale, clientcode:user.clientcode,
       verified:user.verified,resettoken:user.resetToken,passwordreset:user.passwordReset,created:user.created,updated:user.updated,
      accessToken
    })
  } catch (error) {
    res.status(500).json({ error });
  }
}
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    res.status(34).json({ err });
  }
};

exports.getUsers = (req, res, next) => {
  User.find().then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
exports.filteruserrole = (req, res, next) => {
  const {role} = req.body
  User.find({role}).then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.filteruseremail = (req, res, next) => {
  const {email} = req.body
  User.find({email}).then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.filteruserfonction = (req, res, next) => {
  const {fonction} = req.body
  User.find({fonction}).then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.filteruserfirstname = (req, res, next) => {
  const {firstname} = req.body
  User.find({firstname}).then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.filteruserlastname = (req, res, next) => {
  const {lastname} = req.body
  User.find({lastname}).then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.filteruserchoice = async (req, res, next) => {
  const {email,firstname,lastname,fonction,secteur,civilite,raisonsociale,mobile,usertype,nomsociete,clientcode,role} = req.body;
  
  
  await 
  User.find({$or:[{email},{firstname},{fonction},{lastname},{secteur},{mobile},{civilite},{usertype},{raisonsociale},{nomsociete},{role}]}).then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.getUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id
  }).then(
    (user) => {
      res.status(200).json(user);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.updateUser = async (req, res, next) => {
  try {
    const origin =req.get('origin');
    const { email, password,confirmpassword, firstname,lastname, natureactivite,
    activite,
    sousactivite,
    regimefiscalimpot,
    regimefiscaltva,
    matriculefiscale,fonction,secteur,civilite,raisonsociale,mobile,nomsociete,clientcode,role} = req.body
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (req.body.email && user.email !== req.body.email &&await User.findOne({ email: req.body.email })) {
      // send already registered error in email to prevent account enumeration
      return await (sendAlreadyRegisteredEmail(email, origin),res.status(300).json({ error: 'utilisateur avec ce Mail existe déjà!' }))
      
  }
    if (req.body.password&&req.body.confirmpassword) {
      
  
    const hashedPassword = await hashPassword(password);
    const confirmedhashedPassword = await hashPassword(confirmpassword);
    
    


    if (await req.body.password!==req.body.confirmpassword) return await (res.status(301).json({ error: 'Les mot de passes ne sont pas identiques!' }));
    await User.findByIdAndUpdate(_id, { email, password:hashedPassword,confirmpassword:confirmedhashedPassword, firstname,mobile,lastname,natureactivite,
      activite,
      sousactivite,
      regimefiscalimpot,
      regimefiscaltva,
      matriculefiscale,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role});}
    else {await User.findByIdAndUpdate(_id, { email, firstname,lastname,fonction,natureactivite,
      activite,
      sousactivite,
      regimefiscalimpot,
      regimefiscaltva,
      matriculefiscale,secteur,civilite,raisonsociale,nomsociete,mobile,clientcode,role});}
    
    user.updated = Date.now();
    
    await (user.save(),sendupdatecompleteemail(user, origin)).
    then (()=>res.status(200).json({
      data: user,
      message: 'Objet modifié !'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    
    
    
  } catch (error) {
    res.status(35).json({ error });
  }
}

exports.deleteUser = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      await User.findByIdAndDelete(id);

      res.status(200).json({
        data: null,
        message: 'utilisateur supprimé avec succès'
      });
    } catch (error) {
      res.status(36).json({ error });
    }
  }
  
  async function sendupdatecompleteemail(user, origin) {
    let message;
    if (origin) {
        const updatecompleteuserUrl = `${origin}/home`;
        message = `<p>Merci pour votre interaction, nous tenons à vous informer que vous êtes invité une seule fois pour completer votre profil. Toutefois, vous pouvez modifer vos informations personelles quand vous voulez</p>
                   <p><a href="${updatecompleteuserUrl}">${updatecompleteuserUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: user.email,
        subject: 'Vérification de complétude  de votre profil',
        html: `<h4>Suivi Profil</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
  async function sendupdateemail(user, origin) {
    let message;
    if (origin) {
        const updateuserUrl = `${origin}/login`;
        message = `<p>votre profil a été modifiée, veuillez vous connecter pour découvrir les modifications apportées à votre profil</p>
                   <p><a href="${updateuserUrl}">${updateuserUrl}</a></p>`;
    } else {
        message = `<p>Veuillez contacter votre cabinet pour débloquer la situation</p>
                   <p><code>${`${origin}/home/contact#contactid`}</code></p>`;
    }
  
    await sendEmail({
        to: user.email,
        subject: 'Vérification des modifications  de votre profil',
        html: `<h4>Suivi Profil</h4>
               <p>Merci pour votre interaction!</p>
               ${message}`
    });
  }
  async function sendVerificationEmail(newUser, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/verify-email/${newUser.accessToken}`;
        message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/newUser/verify-email</code> api route:</p>
                   <p><code>${newUser.accessToken}</code></p>`;
    }
  
    await sendEmail({
        to: newUser.email,
        subject: 'Sign-up Verification API - Verify Email',
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
    });
  }
  async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
      const alreadyexistUrl = `${origin}/login/forgot-password`;
        message = `<p>If you don't know your password please visit the:</p> 
        <p><a href="${alreadyexistUrl}">${alreadyexistUrl}</a></p>`
      } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }
  
    await sendEmail({
        to: email,
        subject: 'Sign-up Verification API - Email Already Registered',
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
  }
  async function sendPasswordResetEmail(user, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/reset-password/${user.resetToken.token}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/user/reset-password</code> api route:</p>
                   <p><code>${user.resetToken.token}</code></p>`;
    }

    await sendEmail({
        to: user.email,
        subject: 'Sign-up Verification API - Reset Password',
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}
  function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}
async function getAccount(id) {
  
  const user = await User.findById(id);
  if (!user) throw 'Account not found';
  return user;
}
function basicDetails(user) {
  const { id,email, password,confirmpassword, firstname,lastname,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role, created, updated} = user;
  return { id,email, password,confirmpassword, firstname,lastname,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role, created, updated};
}

