const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');

const headphoneSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    brand: { type: Schema.Types.ObjectId, ref: "brand" },
    detail: {
      price: { type: Number, required: true },
      quantity: { type: Number, default: 0 },
      type: { type: String, required: true, trim: true },
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
