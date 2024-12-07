const express = require("express");
const router = express.Router({mergeParams: true});           // whenever we have a model in this "parent route" is having some parameters which can be use in our "callbacks", so we need to add "mergeParams: true" when we require the "Router()" method.
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//Reviews
//Post Review Route
router.post("/", isloggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId", isloggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;