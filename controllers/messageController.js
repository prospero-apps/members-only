const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

// home page
exports.index = (req, res, next) => {
  Message.find()
    .sort({ timestamp: 1 })
    .populate('user')
    .exec(function(err, messages){
      if (err) {
        return next(err)
      }
      res.render('index', { title: 'Messages', user: req.user, messages })
    })
}

// GET message create
exports.message_create_get = (req, res, next) => {
  if (!res.locals.currentUser) {
    res.redirect('/login');
  }
  res.render('message-form', { title: 'Create Message', user: res.locals.currentUser })
}

// POST message create
exports.message_create_post = [
  body('messageTitle', 'Title is required. No more than 80 characters, though.')
    .trim()
    .isLength({ min: 1, max: 80 })
    .escape(),
  body('messageContent', 'Message without message? Seriously? Up to 500 characters.')
    .trim()
    .isLength({ min: 1, max: 500 })
    .escape(),

  // Process request
  (req, res, next) => {
    // errors
    const errors = validationResult(req);  

    // There are errors, render again
    if (!errors.isEmpty()) {
      res.render('message-form', { 
        title: 'Create Message',
        errors: errors.array() 
      });
      return;
    }

    // Create a Message object
    const message = new Message({
      title: req.body.messageTitle,
      user: req.user._id,
      content: req.body.messageContent,
      timestamp: Date.now()
    })

    // Valid data, save message
    message.save((err) => {
      if (err) {
        return next(err);
      }

      // Success
      res.redirect('/');
    })
  }
]

// POST message delete
exports.message_delete_post = (req, res, next) => {
  Message.findByIdAndRemove(req.body.messageId, function deleteMessage(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  })
}
