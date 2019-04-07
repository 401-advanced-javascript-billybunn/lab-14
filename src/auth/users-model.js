'use strict';

/*
http :3000/hidden-stuff "Authorization: Bearer "
// echo '{"role":"superuser", "capabilities":["create","read","update","delete"]}' | http :3000/roles
// echo '{"role":"admin", "capabilities":["read","update","delete"]}' | http :3000/roles
// echo '{"role":"editor", "capabilities":["create", "read", "update"]}' | http :3000/roles
// echo '{"role":"user", "capabilities":["read"]}' | http :3000/roles
*/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '1h';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, default: 'user', enum: ['superuser', 'admin', 'editor', 'user'] },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

users.virtual('abilities', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne: false,
});

// const capabilities = {
//   superuser: ['create', 'read', 'update', 'delete', 'superuser'],
//   admin: ['read', 'update', 'delete'],
//   editor: ['create', 'read', 'update'],
//   user: ['read'],
// };

users.pre('save', function (next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => { throw new Error(error); });
});

users.pre('findOne', function () {
  try {
    console.log('after finding');
    // this.populate('abilities');
    this.populate('abilities', 'capabilities');
  }
  catch (error) { console.log('Find Error', error); }
});

users.statics.createFromOauth = function (email) {

  if (!email) { return Promise.reject('Validation Error'); }

  return this.findOne({ email })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      return user;
    })
    .catch(error => {
      let username = email;
      let password = 'none';
      return this.create({ username, password, email });
    });

};

users.statics.authenticateToken = function (token) {

  if (usedTokens.has(token)) {
    return Promise.reject('Invalid Token');
  }

  try {
    let parsedToken = jwt.verify(token, SECRET);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = { _id: parsedToken.id };
    return this.findOne(query);
  } catch (e) { throw new Error('Invalid Token'); }

};

users.statics.authenticateBasic = function (auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => { throw error; });
};

users.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

users.methods.generateToken = function (type) {

  let token = {
    id: this._id,
    capabilities: this.capabilities,

    type: type || 'user',
  };

  let options = {};
  if (type !== 'key' && !!TOKEN_EXPIRE) {
    options = { expiresIn: TOKEN_EXPIRE };
  }

  return jwt.sign(token, SECRET, options);
};

// takes a capability: 'read', create', 'update', 'delete'
// returns true/false depending on if the user has that capability
users.methods.can = function (capability) {
  console.log(`This route requires the "${capability}" capability to access.
User "${this.username}" has the following abilities: ${this.abilities[0].capabilities}`);

  return this.abilities[0].capabilities.includes(capability);
};

users.methods.generateKey = function () {
  return this.generateToken('key');
};

module.exports = mongoose.model('users', users);
