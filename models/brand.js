const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    shop: { type: Schema.Types.ObjectId, ref: "shop" },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "brands",
  }
);

const brand = mongoose.model("brand", brandSchema);

brandSchema.virtual("headphones", {
  ref: "Headphone",
  localField: "_id",
  foreignField: "brand",
});

module.exports = brand;
