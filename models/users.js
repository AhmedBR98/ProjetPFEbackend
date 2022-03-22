const mongoose = require ('mongoose')

const user= new mongoose.Schema ({
    fname: { type: String  , required : true},
    lname: { type: String  , required : true},
    email: { type: String  , required : true , unique: true},
    pnumber: { type: String  },
    password: { type: String  , required : false},
    birthdate: { type: Date  , required : false},
    gender: { type: String  , required : false},
    type: {type:String},
    accountType:{type:String},
    picture: {type:String}
    // isVerified: { type: Boolean },
    // verificationToken: { type: String }
},
{ collection: 'user-data' }
)
const model = mongoose.model('Userdata' , user)

module.exports = model