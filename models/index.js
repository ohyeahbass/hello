var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/tester");

mongoose.set("debug", true);

module.exports.User = require("./user");