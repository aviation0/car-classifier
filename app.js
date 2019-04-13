var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    multer      = require('multer'),
    xml2js      = require('xml2js'),
    fs          = require("fs");

//require('dotenv').config();

var parser = new xml2js.Parser({explicitArray : false});
var builder = new xml2js.Builder({pretty : true});

var Report = require("./models/report");
var Vehicle = require("./models/vehicle");

var url = process.env.MONGODB_URL || "mongodb://localhost/vehicle";
mongoose.connect(url, { useNewUrlParser: true })
.then(() => {
  console.log('Database connection successful to: '+ url);
})
.catch(err => {
  console.error('Database connection error');
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//multer configuration============================== 
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var upload = multer({ storage: storage});
//===================================================


app.get("/", (req, res) => {
  Report.find({}).populate("vehicles").sort({timestamp : -1}).exec( (err, reports) => {
    if(err){
      console.log(err);
    } else {
      if(req.xhr){
        res.json(reports);
      } else {
        //res.json(reports);
        res.render("index", {reports: reports});
      }
    }
  });
});

app.post("/new", upload.single('file'), (req, res) => {
  //console.log(req.file);
  fs.readFile( req.file.path, function(err, data) {
    
    var json = {};
    parser.parseString(data, (err, result) => {
      json = result;
    });
    const prettyXml = builder.buildObject(json); //string
    //console.log(prettyXml);
    
    Report.create({xmlFile: prettyXml}, (err, report) =>{
      if(err) {
        console.log(err);
      } else {
        var vehicles = json.vehicles.vehicle;
        //console.log(vehicles);
        var structuredVehicles = [];
        
        for (var i = 0; i < vehicles.length; ++i) {
          
          var newVehicle = {};
          newVehicle.vehicleId = vehicles[i].id;
          newVehicle.frame = vehicles[i].frame.material;
          newVehicle.powertrain = vehicles[i].powertrain;
          newVehicle.wheelCount = vehicles[i].wheels.wheel.length;
          newVehicle.type = vehicleType(newVehicle.wheelCount, newVehicle.powerTrain);
          
          structuredVehicles.push(newVehicle);

        }

        Vehicle.create(structuredVehicles, (err, createdVehicles) => {
          if(err){
            console.log(err);
          } else{

            createdVehicles.forEach((vehicle) => {
              report.vehicles.push(vehicle);
              var type = vehicle.type.replace(/ /g,'');
              if(type === "BigWheel")
                report.types.BigWheel++;
              else if(type === "Bicycle")
                report.types.Bicycle ++;
              else if(type === "Motorcycle")
                report.types.Motorcycle++;
              else if(type === "HangGlider")
                report.types.HangGlider++;
              else if(type === "Car")
                report.types.Car++;
            });
            report.originalname = req.file.originalname;
            report.save();
            res.set('Content-Type', 'text/txt'); //to read xml as plain text
            //res.send(JSON.stringify(report,null,2)); //full report
            res.json(report);
            //res.send(report.xmlFile); //original xml
            //console.log(JSON.stringify(report,null,2));
          }
          
        });
        //console.log("Report created");
      }
    });
    
  });
});

app.get("/:id", (req, res) => {
  Report.findById(req.params.id).populate("vehicles").exec(function(err, report){
    if(err){
      console.log(err);
    } else {
      //console.log("HIT"+req.params.id);
      res.json(report);
    }
  });
});


var vehicleType = (wheelCount, powerTrain) => {
  
    if(wheelCount === 2){
      if(powerTrain === "human"){
        return "Bicycle";
      } else {
        return "Motorcycle";
      }
    } else if(wheelCount === 0){
        return "Hang Glider";
    } else if(wheelCount === 3){
        return "Big Wheel";
    } else if(wheelCount ===4){
      return "Car";
    }
}

// vehicleType(testJson);

module.exports = app;