const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "brands",
  }
);

const brand = mongoose.model("Brand", brandSchema);

brandSchema.virtual("headphones", {
  ref: "Headphone",
  localField: "_id",
  foreignField: "brand",
});

module.exports = brand;
