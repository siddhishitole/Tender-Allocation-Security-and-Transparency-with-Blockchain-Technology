const { options } = require("mongoose");
const { Number } = require("mongoose");
var mongoose                =require("mongoose");
var passportLocalMongoose   =require("passport-local-mongoose");

//TABLE SCHEMA
var officerSchema=new mongoose.Schema({

    username:String,
    contactnumber:Number,
    password:String,
    type:String,
    region: {
        type:options,
        allowedValues: ['North India', 'South India', 'West India', 'East India']
    },
    governmentidnumber:Number,
    



});

var bidderSchema=new mongoose.Schema({

    username:String,
    contactnumber:Number,
    password:String,
    type:String,
    dateofbirth:Number,
    companyname:String,
    registerationnumber:Number,
    biddertype: {
    type:options,
    allowedValues: ['Indian', 'Foreigner']
    },
    pannumber:Number,
    region: {
        type:options,
        allowedValues: ['North India', 'South India', 'West India', 'East India']
    },
    governmentidnumber:Number,



});
officerSchema.plugin(passportLocalMongoose);
bidderSchema.plugin(passportLocalMongoose);

//MAKING TABLE
var officers=new mongoose.model("officers", officerSchema);
var bidders=new mongoose.model("bidders", bidderSchema);

//EXPORTING MODULE
module.exports=officers;
module.exports=bidders;



