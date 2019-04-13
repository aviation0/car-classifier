const app = require("./app");

app.listen(process.env.PORT || 3000, process.env.IP, function(){
 console.log("The Car Classifier server has started at!"); 
});