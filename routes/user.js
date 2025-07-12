const express=require("express");
const router=express.Router();
const passport= require("passport");

const wrapAsync = require("../utils/wrapAsync");
const { savedRedirectUrl } = require("../middleware.js");

const userControllers= require("../controllers/users.js")
router.get("/signup",userControllers.signup);

router.post("/signup", wrapAsync(userControllers.signedUp));



router.get("/login",(userControllers.login));

router.post("/login",savedRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",
  failureFlash:true,}),userControllers.loggedIn);

router.get("/logout",userControllers.logout);

module.exports=router;