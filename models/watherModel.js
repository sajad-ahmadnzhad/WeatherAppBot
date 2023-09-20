let mongoose = require("mongoose");

let weatherApp = mongoose.model("weatherapp", {
  cityName: { type: String, required: true },
  countryName: { type: String, required: true },
  statusAir: { type: String, required: true },
  temp: { type: String, required: true },
  minTemp: { type: String, required: true },
  humidity: { type: Number, required: true },
  pressure: { type: Number, required: true },
  speed: { type: Number, required: true },
  deg: { type: Number, required: true },
  clouds: { type: Number, required: true },
  userId: {type: Number , required: true},
  statusAirMain: {type: String , required: true}
});

let yourCityUser = mongoose.model("yourCityUsers", {
  userId: { type: Number, required: true },
  fristName: { type: String, required: true },
  userName: { type: String },
  cityName: { type: String, required: true },
});

module.exports = { weatherApp, yourCityUser };
