var mongoose = require("mongoose");
var reportSchema = new mongoose.Schema({
  types : {
    BigWheel: {type: Number, default: 0},
    Bicycle: {type: Number, default: 0},
    Motorcycle: {type: Number, default: 0},
    HangGlider: {type: Number, default: 0},
    Car: {type: Number, default: 0},
  },
  timestamp: { type: Date, default: Date.now },
  xmlFile: String,
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle"
    }
  ],
  originalname: String
});

module.exports = mongoose.model("Report", reportSchema);
