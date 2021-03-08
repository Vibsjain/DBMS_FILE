const User = require("../models/user.js");
const { use } = require("../routes/auth.js");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require('express-jwt');

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signed-out",
  });
};

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      field: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save to DB",
      });
    }
    res.json({
      id: user._id,
      name: user.name + " " + user.lastname,
      email: user.email,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      field: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER DOES NOT EXIST",
      });
    }
    if (!user.authentication(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    //   Create Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // Send response to front end
    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, name, email, role } });
  });
};

// Protected route
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['sha1', 'RS256', 'HS256'],
  userProperty: "auth"
});

// Custom Middleware
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if(!checker){
    return res.status(403).json({
      error: "ACCESS DENIED"
    })
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0){
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    })
  }
  next();
}