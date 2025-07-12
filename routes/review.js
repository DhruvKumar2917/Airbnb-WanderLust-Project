const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewControllers= require("../controllers/review.js")
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));





router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.deleteReview));
module.exports= router;