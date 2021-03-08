const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "Name must at-least 3 character long").isLength({ min: 3 }),
    check("email", "Email is required").isEmail(),
    check("password", "Password must 5 char long").isLength({ min: 5 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 5 }),
  ],
  signin
);

router.get("/signout", signout);

// router.get("/testroute", isSignedIn, (req, res) => {
//     res.json(req.auth);
// })

module.exports = router;
