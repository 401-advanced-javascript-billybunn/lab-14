'use strict';

/*
echo '{"username":"jerry", "password":"jerry", "role":"editor"}' | http :3000/signup

http post :3000/signin "Authorization: Bearer token"

dude forever key: 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjYTY4ZDE5MDhlYTY0MmRlYmI0MzNkMyIsImNhcGFiaWxpdGllcyI6WyJyZWFkIl0sInR5cGUiOiJrZXkiLCJpYXQiOjE1NTQ0MTk2NzN9.I60vjfKmRyGT9HFlPc3YAKqAEL3H0tGfNiwBGbV-MZ8
*/

const express = require('express');
const router = express.Router();

const auth = require('./middleware.js');
const Role = require('./roles-model.js');

// to populate roles collection in mongoDB
router.post('/roles', (req,res,next) => {
  let role = new Role(req.body);
  role.save();
  res.status(200).send('Saved a new role to the db');
});

// router.get('/public-stuff') should be visible by anyone
router.get('/public-stuff', auth(),(req,res,next) => {
  res.status(200).send('Here\'s the public stuff.');
});

// router.get('/hidden-stuff') should require only a valid login
router.get('/hidden-stuff', auth(),(req,res,next) => {
  res.status(200).send('Shhh… here\'s the hidden stuff.');
});

// router.get('/something-to-read') should require the read capability
router.get('/something-to-read', auth(),(req,res,next) => {
  res.status(200).send('Here\'s something for you to read.');
});

// router.post('/create-a-thing) should require the create capability
router.post('/create-a-thing', auth(),(req,res,next) => {
  res.status(200).send('You can create a thing.');
});

// router.put('/update) should require the update capability
router.put('/update', auth(),(req,res,next) => {
  res.status(200).send('You can update things.');
});

// router.patch('/jp) should require the update capability
router.patch('/jp', auth('update'),(req,res,next) => {
  res.status(200).send('You can also update things.');
});

// router.delete('/bye-bye) should require the delete capability
router.delete('/bye-bye', auth('delete'),(req,res,next) => {
  res.status(200).send('You can delete things.');
});

// router.get('/everything') should require the superuser capability
router.get('/everything', auth(),(req,res,next) => {
  res.status(200).send('You can do EVERYTHING.');
});

module.exports = router;
