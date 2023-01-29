const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');

const headphoneSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    detail: {
      photo:{type: String, default: "nopic.png"},
      quantity: { type: Number, default: 0 },
      type: { type: String, required: true, trim: true },
      brand: { type: String, required: true, trim: true },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      warranty: { type: String, default: "Product without warranty" },
    },
  },
  {
    collection: "headphones",
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

const headphone = mongoose.model("Headphone", headphoneSchema);

module.exports = headphone;
