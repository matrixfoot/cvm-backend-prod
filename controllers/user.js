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
      next(error)
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
    next(error);
  }
}


exports.signup = async (req, res, next) => {
  try {
    const origin = req.headers
    const { email, password,confirmpassword, firstname,lastname,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role} = req.body
    
    const hashedPassword = await hashPassword(password);
    const confirmedhashedPassword = await hashPassword(confirmpassword);
    
    const newUser = new User({email, password:hashedPassword,confirmpassword:confirmedhashedPassword,firstname,lastname,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role: role || "basic" });
    const accessToken = jwt.sign({ userId: newUser._id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: "1d"
    });
    if (await User.findOne({ email: req.body.email })) {
      // send already registered error in email to prevent account enumeration
      return await (sendAlreadyRegisteredEmail(email, origin),res.status(300).json({ error: 'utilisateur avec ce Mail existe déjà!' }))
      
  }
  if (await req.body.password!==req.body.confirmpassword) return await (res.status(301).json({ error: 'Les mot de passes ne sont pas identiques!' }));
    newUser.accessToken = accessToken;
    
    await (newUser.save(),sendVerificationEmail(newUser, origin));
    res.json({
      data: newUser,
      message: "You have signed up successfully"
    })
  } catch (error) {
    next(error)
  }
 
  
}


exports.verifyEmail= async ({ token }) => {
  const user = await User.findOne({ accessToken: token });
  
  if (!user) throw 'vérification échouée';
  
  user.verified = Date.now();
  
  await user.save();
}

exports.forgotPassword=async ({ email }, origin) =>{
  const user = await User.findOne({ email });
  
  // always return ok response to prevent email enumeration
  if (!user) return;
  
  // create reset token that expires after 24 hours
  user.resetToken = {
      token: randomTokenString(),
      expires: new Date(Date.now() + 24*60*60*1000)
  };
  await user.save();

  // send email
  await sendPasswordResetEmail(user, origin);
}

exports.validateResetToken= async({ token }) =>{
  const user = await User.findOne({
      'resetToken.token': token,
      'resetToken.expires': { $gt: Date.now() }
  });
  
  if (!user) throw 'Invalid token';
}

exports.resetPassword=async({ token, password }) =>{
  const user = await User.findOne({ 
      'resetToken.token': token,
      'resetToken.expires': { $gt: Date.now() }
  });
  
  if (!user) throw 'Invalid token';
  
  // update password and remove reset token
  user.password = hash(password);
  user.passwordReset =  Date.now();
  user.resetToken = undefined;
  await user.save();
}
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Mot de passe incorrect !' });
    const accessToken = jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: "1d"
    });
    await User.findByIdAndUpdate(user._id, { accessToken })
    res.status(200).json({
       userId: user._id, email: user.email,password: user.password, role: user.role, Firstname: user.firstname, Lastname: user.lastname, fonction:user.fonction, secteur:user.secteur, civilite:user.civilite,raisonsociale:user.raisonsociale, nomsociete: user.nomsociete, clientcode:user.clientcode,
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
    this.next(err);
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
    const origin = req.headers;
    const { email, password,confirmpassword, firstname,lastname,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role} = req.body
    const hashedPassword = await hashPassword(password);
    const confirmedhashedPassword = await hashPassword(confirmpassword);
    const _id = req.params.id;
    if (await User.findOne({ email: req.body.email })) {
      // send already registered error in email to prevent account enumeration
      return await (sendAlreadyRegisteredEmail(email, origin),res.status(300).json({ error: 'utilisateur avec ce Mail existe déjà!' }))
      
  }


    if (await req.body.password!==req.body.confirmpassword) return await (res.status(301).json({ error: 'Les mot de passes ne sont pas identiques!' }));
    await User.findByIdAndUpdate(_id, { email, password:hashedPassword,confirmpassword:confirmedhashedPassword, firstname,lastname,fonction,secteur,civilite,raisonsociale,nomsociete,clientcode,role});
    const user = await User.findById(_id)
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error)
  }
}

exports.deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      await User.findByIdAndDelete(userId);
      res.status(200).json({
        data: null,
        message: 'User has been deleted'
      });
    } catch (error) {
      next(error)
    }
  }
  async function sendVerificationEmail(newUser, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/newUser/verify-email?token=${newUser.accessToken}`;
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
        message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
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
        const resetUrl = `${origin}/user/reset-password?token=${user.resetToken.token}`;
        message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to reset your password with the <code>/user/reset-password</code> api route:</p>
                   <p><code>${user.resetToken.token}</code></p>`;
    }

    await sendEmail({
        to: account.email,
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

