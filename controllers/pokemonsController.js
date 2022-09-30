const Pokemon = require("../models/pokemonModel");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/AppError");

exports.settingUser = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createPokemon = catchAsync(async (req, res) => {
  const pokemon = await Pokemon.create({
    name: req.body.name,
    attacks: req.body.attacks,
    abilities: req.body.abilities,
    image: req.body.image,
    user: req.body.user,
  });

  res.status(200).json({
    status: "success",
    data: pokemon,
  });
});

exports.getAllPokemons = catchAsync(async (req, res) => {
  let query = Pokemon.find().select("-__v");

  //sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join("");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  if (req.query.page) {
    query = query.skip(skip).limit(limit);
  }

  if (req.query.page) {
    const totalPokemons = await Pokemon.countDocuments();
    if (skip > totalPokemons)
      return next(new AppError("This page doesnot exist!", 404));
  }

  const pokemons = await query;

  if (pokemons.length == 0)
    return next(new AppError("Sorry no pokemons found! Try again later", 404));

  res.status(200).json({
    status: "success",
    data: pokemons,
  });
});

exports.getAPokemon = catchAsync(async (req, res) => {
  const pokemon = await Pokemon.findById(req.params.id);

  if (!pokemon)
    return next(
      new AppError("Sorry no pokemon found with that id! Try again later", 404)
    );

  res.status(200).json({
    status: "success",
    data: pokemon,
  });
});
