const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    propertyType: {
      type: String,
      enum: ["1RK", "1BHK", "2BHK", "3BHK", "Room", "PG"],
      required: true
    },

    rent: {
      type: Number,
      required: true
    },

    deposit: {
      type: Number,
      default: 0
    },

    city: {
      type: String,
      required: true
    },

    area: {
      type: String,
      required: true
    },

    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi-Furnished", "Fully-Furnished"]
    },

    preferredTenant: {
      type: String,
      enum: ["Boys", "Girls", "Family", "Anyone"]
    },

    amenities: [String],

    images: [String],

    available: {
      type: Boolean,
      default: true
    },

    ownerContact: String

  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);