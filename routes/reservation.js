const express = require('express');
const router = express.Router()
const salles = require ('../models/salles')
const reservation = require ('../models/reservations')

router.get('/', (req, res) => {
    var id=req.query.id;
    salles.findById(id, function (err, salle) {
        if(err) console.log(err);
       console.log(salle);
        res.send(salle);
    });
  })

  router.post('/reservation', async (req, res) => {
    try{
      var reservationName=req.body.reservationName;
    var client=req.body.client;
    var salleId=req.body.salleId; 
    var guestNb=req.body.guestNb;   
      
    var dateStart = new Date(req.body.dateStart);
    var dateEnd=dateStart.getTime()+(parseInt(req.body.typeReservation) * 60 * 60 * 1000) ;
    dateEnd=new Date(dateEnd);
    var time=req.body.time + 'Hours';
    var timeStart=req.body.timeStart;
    var totalPrice=req.body.totalPrice ; 


    await reservation.create({
      reservationName:reservationName,
        client:client,
        salleId:salleId,
        guestNb:guestNb,
        dateStart:dateStart,
        dateEnd:dateEnd,
        time:time,
        timeStart:timeStart,
        totalPrice:totalPrice,

    })
    res.json({status:"ok"})
  } catch (err){
    res.json({error:err})
    console.log(err)
  }})


  module.exports = router