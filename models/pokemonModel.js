const mongoose = require("mongoose");

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Pokemon with this name already exist!"],
    required: [true, "Please provide pokemon name"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A pokemon belong to a user"],
  },

  attacks: {
    type: [String],
    required: [true, "Please provide attacks of your pokemon"],
  },

  abilities: {
    type: [String],
    required: [true, "Please provide abilities of your pokemon"],
  },

  image: { type: "string" },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const pokemonModel = mongoose.model("Pokemon", pokemonSchema);
module.exports = pokemonModel;
