var mongoose = require("mongoose");
var vehicleSchema = new mongoose.Schema({
  vehicleId: String,
  type : String,
  frame: String,
  powertrain: String,
  wheelCount: String
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
