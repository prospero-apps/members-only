const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// GET user signup
exports.user_signup_get = (req, res, next) => {
  res.render('signup-form', { title: 'Sign Up' })
}

// POST user signup
exports.user_signup_post = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters long.')
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8, max: 100})
    .withMessage('Password must be between 8 and 100 characters long.')
    .escape(),
  body("confirm")
    .trim()
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match.')
    .escape(),

  // Process request
  (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    // There are errors, render again
    if (!errors.isEmpty()) {
      res.render("signup-form", {
        title: 'Sign Up',
        user: req.body,
        errors: errors.array()
      });
      return;
    }

    // Data is valid, create and save User object
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        isMember: false,
        isAdmin: false,
      });

      user.save((err) => {
        if (err) {
          return next(err);
        }
        // Success - redirect to Home Page
        res.redirect('/');
      })
    })    
  }
];

// GET user login
exports.user_login_get = (req, res, next) => {
  // If logged in, redirect to home page
  if (res.locals.currentUser) {
    res.redirect('/');
  }
  res.render('login-form', { title: 'Log In'});
}

// POST user login
exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
});

// GET user logout
exports.user_logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
}

// GET user become member
exports.user_becomeMember_get = (req, res, next) => {
  // must be logged in
  if (!res.locals.currentUser) {
    res.redirect('/login');
  }

  res.render('member-form', {
    title: 'Become a Member',
    user: res.locals.currentUser
  })  
}

// POST user become member
exports.user_becomeMember_post = [
  body("memberCode")
    .trim()
    .isLength({ min: 1 })
    .withMessage('Member code is required.')
    .escape(),

  // Process request
  (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    // There are errors, render again
    if (!errors.isEmpty()) {
      res.render("member-form", {
        title: 'Become a Member',
        user: res.locals.currentUser,
        errors: errors.array()
      });
      return;
    } else if (req.body.memberCode != process.env.MEMBER_CODE) {
      res.render("member-form", {
        title: 'Become a Member',
        user: res.locals.currentUser,
        codeError: 'Wrong member code, try again.'
      });
      return;
    }

    // Data is valid, set user as member 
    const user = new User(res.locals.currentUser);
    user.isMember = true;

    User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    })         
  }
];

// GET user become admin
exports.user_becomeAdmin_get = (req, res, next) => {
  // must be logged in
  if (!res.locals.currentUser) {
    res.redirect('/login');
  }

  res.render('admin-form', {
    title: 'Become an Admin',
    user: res.locals.currentUser
  })  
}

// POST user become admin
exports.user_becomeAdmin_post = [
  body("adminCode")
    .trim()
    .isLength({ min: 1 })
    .withMessage('Admin code is required.')
    .escape(),

  // Process request
  (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    // There are errors, render again
    if (!errors.isEmpty()) {
      res.render("admin-form", {
        title: 'Become an Admin',
        user: res.locals.currentUser,
        errors: errors.array()
      });
      return;
    } else if (req.body.adminCode != process.env.ADMIN_CODE) {
      res.render("admin-form", {
        title: 'Become an Admin',
        user: res.locals.currentUser,
        codeError: 'Wrong admin code, try again.'
      });
      return;
    }

    // Data is valid, set user as admin 
    const user = new User(res.locals.currentUser);
    user.isAdmin = true;

    User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    })         
  }
];
