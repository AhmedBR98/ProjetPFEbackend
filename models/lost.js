const mongoose = require ('mongoose')

const Lost= new mongoose.Schema ({
 title : {type:String} ,
 description : {type:String},
 Img: {type:String},
 date: {type:Date},
 accepted:{type:String},
 status:{type:String}
},
{ collection: 'Lost' }
)
const model = mongoose.model('Lost' , Lost)

module.exports = model