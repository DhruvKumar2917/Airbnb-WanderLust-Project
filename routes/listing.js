const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ListingControllers=require("../controllers/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

router
.route("/")
.get(wrapAsync(ListingControllers.index ))
.post(isLoggedIn,upload.single("listing[image]") ,validateListing, wrapAsync(ListingControllers.createListing));
//Index Route
// router.get("/",wrapAsync(ListingControllers.index ));

//New Route
router.get("/new", isLoggedIn,ListingControllers.renderNew);

//Show Route
router.get("/:id", wrapAsync(ListingControllers.showListing));


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync (ListingControllers.editListing));

//Create Route
 router.post("/",isLoggedIn,validateListing, wrapAsync(ListingControllers.createListing));




//Update Route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]") ,validateListing,wrapAsync(ListingControllers.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync (ListingControllers.deleteListing));
module.exports=router;