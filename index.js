const express = require('express')
const app = express()
const cors=require("cors")
const formidable = require('formidable')
var user=require("./routes/user");
var reservation=require("./routes/reservation");
var lost=require("./routes/lost");
var bodyParser = require('body-parser')
//Import the mongoose module
var mongoose = require('mongoose');
app.use(bodyParser.json())
app.use(cors())
//Set up default mongoose connection
var mongoDB = 'mongodb+srv://level1app:CfQo5mmGOKEy3kBd@cluster0.uwj5t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use("/user",user);
app.use("/reservation",reservation);
app.use("/lost", lost )
app.listen(8000, () => {
    console.log(`Example app listening on port 8000`)
  })