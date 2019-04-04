'use strict';

const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
  role: {type: String, required:true},
  capabilities: {type: Array, required:true},
}, {toObject:{virtuals:true}, toJSON:{virtuals:true}});

rolesSchema.virtual('users', {
  ref: 'users',
  localField: 'role',
  foreignField: 'role',
  justOne: false,
});

rolesSchema.pre('find', function() {
  try {
    this.populate('users');
  }
  catch(err) { console.log('Find Error', err); }
});

/*
const teams = mongoose.Schema({
  name: { type:String, required:true },
}, {toObject:{virtuals:true}, toJSON:{virtuals:true}} );

teams.virtual('players', {
  ref: 'players',
  localField: 'name',
  foreignField: 'team',
  justOne: false,
});

teams.pre('find', function() {
  try {
    this.populate('players');
  }
  catch(e) { console.log('Find Error', e); }
});
*/

module.exports = mongoose.model('roles', rolesSchema);
