'use strict';

/*
HTTPie CLI commands to add some roles:
echo '{"role":"user", "capabilities":["read"]}' | http :3000/roles
echo '{"role":"editor", "capabilities":["create", "read", "update"]}' | http :3000/roles
echo '{"role":"admin", "capabilities":["create","read","update","delete"]}' | http :3000/roles
echo '{"role":"superuser", "capabilities":["create","read","update","delete","superuser"]}' | http :3000/roles


HTTPie CLI commands to add some users:
echo '{"username":"usher", "password":"usher", "role":"user"}' | http :3000/signup
echo '{"username":"eddie", "password":"eddie", "role":"editor"}' | http :3000/signup
echo '{"username":"addie", "password":"addie", "role":"admin"}' | http :3000/signup
echo '{"username":"susie", "password":"susie", "role":"superuser"}' | http :3000/signup

superuser guy key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjYTZjNzFkYjE3YTAwM2FhYjUyMjEyZiIsInR5cGUiOiJrZXkiLCJpYXQiOjE1NTQ2NDA4MzB9.lNpU_iMPXzIJtXVmRqACmmr2ZvPMUlY3R8QkuNQkKqE

editor jerry key: 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjYTZiZDIwNzJkMjc0MzZmOTRkOWVkMyIsInR5cGUiOiJrZXkiLCJpYXQiOjE1NTQ2NDE5NjF9.3XQ7brtY8iubbx3mB49ccX0l_5ODvo-LaO4Iy23Rgbs

http post :3000/signin "Authorization: Bearer token"

http :3000/hidden-stuff "Authorization: Bearer token"


*/

const express = require('express');
const router = express.Router();

const auth = require('./middleware.js');
const Role = require('./roles-model.js');

// to populate roles collection in mongoDB
router.post('/roles', (req,res,next) => {
  let role = new Role(req.body);
  role.save();
  res.status(200).send('Saved a new role to the db.');
});

// router.get('/public-stuff') should be visible by anyone
router.get('/public-stuff', (req,res,next) => {
  res.status(200).send('Here\'s the public stuff.');
});

// router.get('/hidden-stuff') should require only a valid login
router.get('/hidden-stuff', auth(),(req,res,next) => {
  res.status(200).send('Shhh… here\'s the hidden stuff.');
});

// router.get('/something-to-read') should require the read capability
router.get('/something-to-read', auth('read'),(req,res,next) => {
  res.status(200).send('Here\'s something for you to read.');
});

// router.post('/create-a-thing) should require the create capability
router.post('/create-a-thing', auth('create'),(req,res,next) => {
  res.status(200).send('You can create a thing.');
});

// router.put('/update) should require the update capability
router.put('/update', auth('update'),(req,res,next) => {
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
router.get('/everything', auth('superuser'),(req,res,next) => {
  res.status(200).send('You can do EVERYTHING.');
});

module.exports = router;
