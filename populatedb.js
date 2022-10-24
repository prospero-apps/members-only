#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const User = require('./models/user')
const Message = require('./models/message')

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const users = []
const messages = []

function userCreate(username, password, isMember, isAdmin, cb) {
  userdetail = {
    username,
    password,
    isMember,
    isAdmin
  }
  const user = new User(userdetail);
       
  user.save((err) => {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function messageCreate(title, content, timestamp, user, cb) {
  messagedetail = { 
    title,
    content,
    timestamp
  }
  if (user != false) messagedetail.user = user
    
  const message = new Message(messagedetail);    
  message.save((err) => {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Message: ' + message);
    messages.push(message)
    cb(null, message)
  }  );
}


function createUsers(cb) {
  async.series([
    function(callback) {
      userCreate('plainuser', 'abc', false, false, callback);
    },
    function(callback) {
      userCreate('memveruser', 'def', true, false, callback);
    },
    function(callback) {
      userCreate('adminuser', 'ghi', true, true, callback);
    },
  ], cb);
}


function createMessages(cb) {
  async.series([
    function(callback) {
      messageCreate("Hello", "Hey guys. What's up? I'm new here.", Date.now(), users[0], callback);
    },
    function(callback) {
      messageCreate("Question", "Hey, am I allowed to ask difficult questions here?", Date.now(), users[1], callback);
    },
    function(callback) {
      messageCreate("Welcome Message", "Welcome to my site. Use the 'c4KKp2m' code to become a member. Use the 's64aar' code to become an admin.", Date.now(), users[2], callback);
    },
  ], cb);
}

async.series([
    createUsers,
    createMessages
], (err, results) => {
  if (err) {
    console.log('FINAL ERR: '+err);
  } else {
    console.log(`Success: ${results}`);
      
  }
  mongoose.connection.close();
});



