const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");

const ProfileSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: String,
    address: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    birthDate: Date,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    occupation: String,
    website: String,
    status: {
      type: String,
      enum: ["married", "single", "relationship"],
    },
    bio: String,
    avatar: {
      type: String,
      default: "/images/no-photo.jpg",
    },
    coverPhoto: {
      type: String,
      default: "/images/no-cover.jpg",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

ProfileSchema.pre("save", async function (next) {
  // if (!this.isModified("address")) {
  //   return next();
  // }
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
  next();
});

module.exports = mongoose.model("Profile", ProfileSchema);
