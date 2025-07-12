const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken: mapToken});

module.exports.index =async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}
  module.exports.renderNew =(req, res) => {
  
  res.render("listings/new.ejs");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:
      {
        path:"author",
      },
 } ).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // ✅ Prevents double response
    }
    console.log(listing);

    res.render("listings/show.ejs", { listing });
};

module.exports.editListing=  async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // ✅ Prevents double response
    }
    let originalImageUrl=listing.image.url;
     originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.createListing = async (req, res) => {
  const geoResponse = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  // Check if geometry was found
  if (!geoResponse.body.features.length) {
    req.flash("error", "Could not find that location on the map.");
    return res.redirect("/listings/new");
  }

  const { path, filename } = req.file;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: path, filename };

  // ✅ Set geometry correctly
  const geometry = geoResponse.body.features[0].geometry;

  // Confirm 'type' and 'coordinates' exist before assignment
  if (!geometry?.type || !geometry?.coordinates) {
    req.flash("error", "Invalid location data from Mapbox.");
    return res.redirect("/listings/new");
  }

  newListing.geometry = geometry;

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};


 module.exports.updateListing = async (req, res) => {
    if(!req.body.listing){
      throw new ExpressError(400,"Send Valid Data For Listing");
    }
    let { id } = req.params;
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file!== "undefined"){
     let url=req.file.path;
 let filename=req.file.filename;
 listing.image ={url,filename};
 await listing.save();
   }
   
  
     req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
  };

 module.exports.deleteListing =async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success","Listing Deleted");
  res.redirect("/listings");
};