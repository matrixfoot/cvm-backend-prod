const User = require('../models/user');
const Userdeleted = require('../models/user-deleted');
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
          error: "vous n'avez pas la permission d'éxécuter cette action"
        });
      }
      if (action=='updateOwn'||action=='readOwn'||action=='deleteOwn')
      {
        if (req.params.id && req.baseUrl=='/api/users')
        {
        if (res.locals.loggedInUser._id != req.params.id&&req.user.role!='admin'&&req.user.role!='supervisor') 
        { return (console.log(req.baseUrl),res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'}))}
      } 
      else if (!req.params.id&&req.body.userId)
      {
        if (res.locals.loggedInUser._id != req.body.userId&&req.user.role!='admin'&&req.user.role!='supervisor') 
        { return (res.status(401).json({error: 'vous n\'avez pas la permission d\'éxécuter cette action'}),console.log(res.locals.loggedInUser._id),
        console.log(req.body));
        }
      }
      }
     

      next()
    } catch (error) {
      res.status(404).json({ error });
    }
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "vous devez être connecté pour éxécuter cette action"
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
    const { email, password,confirmpassword, firstname,lastname,usertype,fonction,secteur,civilite,nature,raisonsociale,mobile,adresseactivite,codepostal,desactive,nomsociete,clientcode,role} = req.body
    
    const hashedPassword = await hashPassword(password);
    const confirmedhashedPassword = await hashPassword(confirmpassword);
    
    const newUser = new User({email, password:hashedPassword,confirmpassword:confirmedhashedPassword,firstname,usertype,lastname,mobile,fonction,adresseactivite,desactive,codepostal,secteur,civilite,nature,raisonsociale,nomsociete,clientcode,role: role || "basic" });
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
if (await User.findOne({ clientcode: req.body.clientcode })) {
    
    return await (res.status(300).json({ error: 'utilisateur avec ce code client existe déjà,veuillez générer un autre code client!' }))
    
    
}
  if (await req.body.password!==req.body.confirmpassword) return await (res.status(301).json({ error: 'Les mot de passes ne sont pas identiques!' }));
    newUser.accessToken = accessToken;
    newUser.desactive.statut=false;
    newUser.desactive.date = Date.now();
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
/*insert many users*/
exports.createmultipleusers = async (req, res, next) => {
  try {
let newusers= req.body
  //const newEvent = new Event({ title, date,description })
 
  
newusers.forEach(async (item, index) => {
item.email=`${newusers[index].email}`
item.password=await hashPassword(`${newusers[index].password}`)
item.confirmpassword=await hashPassword(`${newusers[index].confirmpassword}`)
item.nature=`${newusers[index].nature}`
item.firstname=`${newusers[index].firstname}`
item.lastname=`${newusers[index].lastname}`
item.usertype=`${newusers[index].usertype}`
item.clientcode=`${newusers[index].clientcode}`
item.role=`${newusers[index].role}`
item.verified=`${newusers[index].verified}`
item.desactive.statut=`${newusers[index].desactive}`
item.raisonsociale=`${newusers[index].raisonsociale}`

const newuser = new User({email:item.email,password:item.password,confirmpassword:item.confirmpassword,nature:item.nature,firstname:item.firstname,lastname:item.lastname,
  usertype:item.usertype,clientcode:item.clientcode,role:item.role,verified:item.verified,raisonsociale:item.raisonsociale});
newuser.desactive.statut=`${newusers[index].desactive}`
console.log(newuser.desactive.statut)  
console.log(newuser)

newuser.save();
   })
  res.status(201).json(
    {
      data: newusers,
        type: "succès",
        message: "utilisateurs créés"
    }
);
} catch (error) {
  res.status(409).json({ message: error.message });
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
    const userdeleted = await Userdeleted.findOne({ email });
    if (userdeleted) return res.status(401).json({ error: 'Utilisateur supprimé temporairement! veuillez contactez votre cabinet pour débloquer la situation' });
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    if (!user.verified) return res.status(401).json({ error: 'Compte pas encore vérifié, veuillez cliquer sur le mail de vérification envoyé à votre adresse: !' });
    if (user.desactive.statut===true) return res.status(401).json({ error: 'Compte désactivé, veuillez contacter votre cabinet MaCompta pour débloquer la situation!' });
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Mot de passe incorrect !' });
    const accessToken = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: "10000d"
    });
    await User.findByIdAndUpdate(user._id, { accessToken })
    
    res.status(200).json({
       userId: user._id, email: user.email,password: user.password,confirmpassword: user.confirmpassword, role: user.role,
       acceptterms: user.acceptTerms, Firstname: user.firstname, Lastname: user.lastname,adresseactivite:user.adresseactivite,codepostal:user.codepostal, 
       fonction:user.fonction, secteur:user.secteur, civilite:user.civilite,nature:user.nature,usertype:user.usertype,mobile:user.mobile,
       raisonsociale:user.raisonsociale, nomsociete: user.nomsociete,natureactivite:user.natureactivite,
       activite:user.activite,specialite:user.specialite,sousspecialite:user.sousspecialite,choixfacture:user.choixfacture,numeronote:user.numeronote,
       sousactivite:user.sousactivite,droitcompta:user.droitcompta,rolesuperviseur:user.rolesuperviseur,
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
exports.getUsersdeleted = (req, res, next) => {
  Userdeleted.find().then(
    (usersdeleted) => {
      res.status(200).json(usersdeleted);
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
  const {email,firstname,lastname,fonction,secteur,civilite,nature,raisonsociale,mobile,usertype,nomsociete,clientcode,role} = req.body;
  
  
  await 
  User.find({$or:[{email},{firstname},{fonction},{lastname},{secteur},{mobile},{civilite},{nature},{usertype},{raisonsociale},{nomsociete},{role}]}).then(
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
exports.getUserdeleted = (req, res, next) => {
  Userdeleted.findOne({
    _id: req.params.id
  }).then(
    (userdelted) => {
      res.status(200).json(userdelted);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
exports.completeUser = async (req, res, next) => {
  try {
    const origin =req.get('origin');
    const { email, password,confirmpassword, firstname,lastname, natureactivite,
    activite,specialite,sousspecialite,
    sousactivite,droitcompta,rolesuperviseur,
    regimefiscalimpot,
    regimefiscaltva,
    matriculefiscale,fonction,secteur,choixfacture,numeronote,usertype,civilite,nature,raisonsociale,adresseactivite,codepostal,mobile,nomsociete,clientcode,role} = req.body
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
      activite,specialite,sousspecialite,
      sousactivite,usertype,droitcompta,rolesuperviseur,
      regimefiscalimpot,choixfacture,numeronote,
      regimefiscaltva,
      matriculefiscale,fonction,secteur,civilite,nature,raisonsociale,adresseactivite,codepostal,nomsociete,clientcode,role});}
    else {await User.findByIdAndUpdate(_id, { email, firstname,lastname,fonction,natureactivite,
      activite,specialite,sousspecialite,
      sousactivite,usertype,droitcompta,rolesuperviseur,
      regimefiscalimpot,choixfacture,numeronote,
      regimefiscaltva,
      matriculefiscale,secteur,civilite,nature,raisonsociale,adresseactivite,codepostal,nomsociete,mobile,clientcode,role});}
    
    user.updated = Date.now();
    
    await (user.save(),sendupdatecompleteemail(user, origin)).
    then (()=>res.status(200).json({
      data: user,
      message: 'Objet modifié !'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    
    
    
  } catch (error) {
    res.status(400).json({ error });
  }
}

exports.updateUser = async (req, res, next) => {
  try{
    const origin =req.get('origin');
    const userObject = req.file ?
      {
        ...JSON.parse(req.body.user),
        ficheUrl: `${req.file.url}`
      } : { ...req.body};
    const _id = req.params.id;
    const user = await User.findById(_id);
    const codepostal = userObject.codepostal;
    const adresseactivite = userObject.adresseactivite;
    const ficheUrl = userObject.ficheUrl;
    const activite=userObject.activite
    const specialite=userObject.specialite
    const sousspecialite=userObject.sousspecialite
    const email=userObject.email
    const firstname=userObject.firstname
    const lastname=userObject.lastname
    const natureactivite=userObject.natureactivite
    const sousactivite=userObject.sousactivite
    const regimefiscalimpot=userObject.regimefiscalimpot
    const regimefiscaltva=userObject.regimefiscaltva
    const droitcompta=userObject.droitcompta
    const rolesuperviseur=userObject.rolesuperviseur

    const matriculefiscale=userObject.matriculefiscale
    const fonction=userObject.fonction
    const secteur=userObject.secteur
    const civilite=userObject.civilite
    const nature=userObject.nature
    const raisonsociale=userObject.raisonsociale
    const mobile=userObject.mobile
    const nomsociete=userObject.nomsociete
    const clientcode=userObject.clientcode
    const role=userObject.role
    if (req.body.email && user.email !== req.body.email &&await User.findOne({ email: req.body.email })) {
      // send already registered error in email to prevent account enumeration
      return await (sendAlreadyRegisteredEmail(email, origin),res.status(300).json({ error: 'utilisateur avec ce Mail existe déjà!' }))
      
  }
  if (req.body.mobile && user.mobile !== req.body.mobile &&await User.findOne({ mobile: req.body.mobile })) {
    
    return await (res.status(300).json({ error: 'utilisateur avec ce Mobile existe déjà!' }))
    
    
}
    if (userObject.password&&userObject.confirmpassword) {
      
  
    const hashedPassword = await hashPassword(userObject.password);
    const confirmedhashedPassword = await hashPassword(userObject.confirmpassword);

    


    if (await req.body.password!==req.body.confirmpassword) return await (res.status(301).json({ error: 'Les mot de passes ne sont pas identiques!' }));
    await User.findByIdAndUpdate(_id, { ...userObject,password:hashedPassword,confirmpassword:confirmedhashedPassword});}
    else {await User.findByIdAndUpdate(_id, {  codepostal : userObject.codepostal,
       adresseactivite : userObject.adresseactivite,
       ficheUrl : userObject.ficheUrl,
       activite:userObject.activite,specialite:userObject.specialite,sousspecialite:userObject.sousspecialite,
       email:userObject.email,
       firstname:userObject.firstname,
       lastname:userObject.lastname,
       natureactivite:userObject.natureactivite,
       sousactivite:userObject.sousactivite,
       regimefiscalimpot:userObject.regimefiscalimpot,
       regimefiscaltva:userObject.regimefiscaltva,
       matriculefiscale:userObject.matriculefiscale,
       droitcompta:userObject.droitcompta,
       rolesuperviseur:userObject.rolesuperviseur,

       fonction:userObject.fonction,
       secteur:userObject.secteur,
       civilite:userObject.civilite,nature:userObject.nature,

       raisonsociale:userObject.raisonsociale,
       mobile:userObject.mobile,
       nomsociete:userObject.nomsociete,
       clientcode:userObject.clientcode,
       role:userObject.role})}
    
    user.updated = Date.now();
    console.log(userObject)
    //console.log(req.body)
    //console.log(req.file)
    await (user.save(),sendupdateemail(user, origin)).
    then (()=>res.status(200).json({
      data: user,
      message: 'Objet modifié !'
    }))
    .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
    } catch (error) {
      res.status(400).json({ error });
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
      res.status(400).json({ error });
    }
  }
  exports.deleteUsertemporare = async (req, res, next) => {
    
      const id = req.params.id;
      const userdeleted=new Userdeleted;
      const user = await User.findById(id);
      userdeleted.email = user.email;
      userdeleted.firstname = user.firstname;
      userdeleted.lastname = user.lastname;
      userdeleted._id = user._id;
      userdeleted.adresseactivite=user.adresseactivite;
      userdeleted.codepostal=user.codepostal;
      userdeleted.natureactivite=user.natureactivite;
      userdeleted.activite=user.activite;
      userdeleted.specialite=user.specialite;
      userdeleted.sousspecialite=user.sousspecialite;
      userdeleted.sousactivite=user.sousactivite;
      userdeleted.regimefiscalimpot=user.regimefiscalimpot;
      userdeleted.regimefiscaltva=user.regimefiscaltva;
      userdeleted.matriculefiscale=user.matriculefiscale;
      userdeleted.desactive = user.desactive;
      userdeleted.password = user.password;
      userdeleted.confirmpassword = user.confirmpassword;
      userdeleted.fonction = user.fonction;
      userdeleted.secteur = user.secteur;
      userdeleted.civilite = user.civilite;
      userdeleted.nature = user.nature;
      userdeleted.usertype = user.usertype;
      userdeleted.mobile = user.mobile;
      userdeleted.raisonsociale = user.raisonsociale;
      userdeleted.nomsociete = user.nomsociete;
      userdeleted.clientcode = user.clientcode;
      userdeleted.role = user.role;
      userdeleted.droitcompta = user.droitcompta;
      userdeleted.rolesuperviseur = user.rolesuperviseur;
      userdeleted.created = user.created;
      userdeleted.accessToken = user.accessToken;
      userdeleted.resetToken = user.resetToken;
      userdeleted.verified=user.verified;
      userdeleted.passwordReset=user.passwordReset;
      userdeleted.updated=user.updated
      
      if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      
      userdeleted.deleted=Date.now();
      userdeleted.save();
      await User.findByIdAndDelete(id);

      res.status(200).json({
        data: userdeleted,
        message: 'utilisateur supprimé temporairement avec succès'
      });
    
  }
  
  exports.restaureuser = async (req, res, next) => {
    try {
      const id = req.params.id;
      const userdeleted = await Userdeleted.findById(id);
      user =new User;
      user.email=userdeleted.email;
      user.firstname=userdeleted.firstname;
      user.lastname=userdeleted.lastname;
      user._id=userdeleted._id;
      user.adresseactivite=userdeleted.adresseactivite;
      user.codepostal=userdeleted.codepostal;
      user.natureactivite=userdeleted.natureactivite;
      user.activite=userdeleted.activite;
      user.specialite=userdeleted.specialite;
      user.sousspecialite=userdeleted.sousspecialite;
      user.sousactivite=userdeleted.sousactivite;
      user.regimefiscalimpot=userdeleted.regimefiscalimpot;
      user.regimefiscaltva=userdeleted.regimefiscaltva;
      user.matriculefiscale=userdeleted.matriculefiscale;
      user.desactive = userdeleted.desactive;
      user.password = userdeleted.password;
      user.confirmpassword = userdeleted.confirmpassword;
      user.fonction = userdeleted.fonction;
      user.secteur = userdeleted.secteur;
      user.civilite = userdeleted.civilite;
      user.nature = userdeleted.nature;
      user.droitcompta = userdeleted.droitcompta;
      user.rolesuperviseur = userdeleted.rolesuperviseur;
      user.usertype = userdeleted.usertype;
      user.mobile = userdeleted.mobile;
      user.raisonsociale = userdeleted.raisonsociale;
      user.nomsociete = userdeleted.nomsociete;
      user.clientcode = userdeleted.clientcode;
      user.role = userdeleted.role;
      user.created = userdeleted.created;
      user.accessToken = userdeleted.accessToken;
      user.resetToken = userdeleted.resetToken;
      user.verified=userdeleted.verified;
      user.passwordReset=userdeleted.passwordReset;
      user.updated=userdeleted.updated
      if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      
      user.restaured=Date.now();
      user.save();
      await Userdeleted.findByIdAndDelete(id);

      res.status(200).json({
        data: user,
        message: 'utilisateur restauré avec succès'
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  exports.desactivateUser = async (req, res, next) => {
    try {
        
        
      const userObject = req.file ?
        {
          ...JSON.parse(req.body.user),
          ficheUrl: `${req.file.url}`
        } : { ...req.body };
      const _id = req.params.id;
      const user =  await User.findById(_id);
      
      await User.findByIdAndUpdate(_id, { ...userObject});
      user.desactive.statut=true;    
      user.desactive.date = Date.now();
       await user.save().
      then (()=> res.status(200).json({
        data: user,
        message: 'Utilisateur désactivé avec succès!'
      }))
      .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  exports.activateUser = async (req, res, next) => {
    try {
        
        
      const userObject = req.file ?
        {
          ...JSON.parse(req.body.user),
          ficheUrl: `${req.file.url}`
        } : { ...req.body };
      const _id = req.params.id;
      const user =  await User.findById(_id);
      
      await User.findByIdAndUpdate(_id, { ...userObject});
      user.desactive.statut=false;    
      user.desactive.date = Date.now();
       await user.save().
      then (()=> res.status(200).json({
        data: user,
        message: 'Utilisateur restauré avec succès!'
      }))
      .catch(error => res.status(400).json({ error , message: 'opération non aboutie veuillez réessayer'}));
      
    } catch (error) {
      res.status(404).json({ error });
    }
  }
  
  async function sendupdatecompleteemail(user, origin) {
    let message;
    if (origin) {
        const completer = `${origin}/home`;
        message = `<p>Merci pour votre interaction, nous tenons à vous informer que vous êtes invité une seule fois pour compléter votre profil.
         Toutefois, vous pouvez modifer vos informations personelles quand vous voulez <a href="${completer}"> Retour à MaCompta </a> </p>`;
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
        message = `<p>votre profil a été modifiée, veuillez vous <a href="${updateuserUrl}"> connecter </a> pour découvrir les modifications apportées à votre profil</p>`;
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
        message = `<p>Prière de cliquer <a href="${verifyUrl}"> ici </a> pour activer votre compte</p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/newUser/verify-email</code> api route:</p>
                   <p><code>${newUser.accessToken}</code></p>`;
    }
  
    await sendEmail({
        to: newUser.email,
        subject: 'Vérification inscription - Email de vérification',
        html: `<h4>Email de vérification</h4>
               <p>Merci pour votre inscription!</p>
               ${message}`
    });
  }
  async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
      const ici = `${origin}/login/forgot-password`;
        message = `<p>Si vous avez oublié votre mot de passe, veuillez cliquez <a href="${ici}"> ici </a> </p>`
      } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }
  
    await sendEmail({
        to: email,
        subject: 'Compte déjà existant',
        html: `<h4>Compte existant</h4>
               <p>votre email <strong>${email}</strong> existe déjà</p>
               ${message}`
    });
  }
  async function sendPasswordResetEmail(user, origin) {
    let message;
    if (origin) {
        const resetUrl = `${origin}/reset-password/${user.resetToken.token}`;
        message = `<p>Merci de cliquer <a href="${resetUrl}"> ici </a> pour regénérer votre mot de passe, le lien restera valide durant 24h!</p>
        
                   <p></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/user/reset-password</code> api route:</p>
                   <p><code>${user.resetToken.token}</code></p>`;
    }

    await sendEmail({
        to: user.email,
        subject: 'Regénération mot de passe',
        html: `<h4>email de regénération de mot de passe</h4>
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

