const mongoose = require ('mongoose')

const Salles= new mongoose.Schema ({
    title: { type: String  , required : true},
    description: { type: String  , required : true},
    minimum: { type:Number },
    priceHour: { type: Number},
    priceHalfDay : { type : Number},
    priceFullDay : { type : Number},
},
{ collection: 'Salles' }
)
const model = mongoose.model('Salles' , Salles)

module.exports = model