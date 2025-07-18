
const User=require("../models/user.js");

module.exports.signup=(req,res)=>{
  res.render("users/signup.ejs");
}


module.exports.signedUp=async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Welcome to WanderLust");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
    });
  } catch (e) {
    next(e);
  }
}

module.exports.login=(req,res)=>{
  res.render("users/login.ejs");
}


module.exports.loggedIn=async(req,res)=>{
    req.flash("success","Welcome to WanderLust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
  
  }

 module.exports.logout= (req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
  });
}