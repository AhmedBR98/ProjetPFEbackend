const mongoose = require ('mongoose')

const reservations= new mongoose.Schema ({
    reservationName: { type: String},
    client: { type: String , unique: true},
    salleId: { type: String },
    guestNb: {type : Number},
    dateStart: { type: String  , required : true},
    dateEnd: { type: String },
    totalPrice : { type: String },
    time: {type:String},
    timeStart: {type:String},
},
{ collection: 'reservations' }
)
const model = mongoose.model('reservations' , reservations)

module.exports = model