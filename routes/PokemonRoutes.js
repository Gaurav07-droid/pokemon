const express = require("express");
const pokemonController = require("../controllers/pokemonsController");
const authController = require("../controllers/authcontroller");

const router = express.Router();

router.use(authController.protect);

router
  .route("/pokemons")
  .post(pokemonController.createPokemon)
  .get(pokemonController.getAllPokemons);

router.route("/pokemons/:id").get(pokemonController.getAPokemon);

module.exports = router;
