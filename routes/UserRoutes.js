const express = require("express");
const router = express.Router();
const { findUserById } = require("../controllers/UserController");
const { requireSignin } = require("../controllers/AuthController");

//it has userId and requireSignin middleware
router.get("/secret/:userId", requireSignin, (req, res) => {
    res.json({
        user: req.profile
    })
});

//param --> wheneever the url or route get the userId variable it goes to that method/controller and get the user by that id
router.param("userId", findUserById);

module.exports = router;
