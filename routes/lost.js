const express = require('express');
const router = express.Router()
var formidable = require('formidable');
const salles = require ('../models/salles')
const lost = require ('../models/lost')
const path=require('path')
const fs=require('fs');


router.get('/', (req, res) => {
    lost.find({}, function (err, lost) {
        if(err) console.log(err);
        res.send(lost);
    });
  })
  router.get('/posts', (req, res) => {
    lost.find({accepted:'Accepted'}, function (err, lost) {
        if(err) console.log(err);
        res.send(lost);
    });
  })
  router.get('/pendingposts', (req, res) => {
    lost.find({accepted:'Pending'}, function (err, lost) {
        if(err) console.log(err);
        res.send(lost);
    });
  })
  router.post('/delete',async(req,res)=>{
    try{
    var id=req.body.id;
    await lost.deleteOne({_id:id});
    res.json({'status':'updated'})}
    catch(err){
      res.json({'err':err})
    }
  })
router.post('/update',async(req,res)=>{
  try{
  var id=req.body.id;
  var decision=req.body.decision;
  var post=await lost.findById(id).exec();
  post.accepted=decision;
  await post.save();
  res.json({'status':'updated'})}
  catch(err){
    res.json({'err':err})
  }
})
  router.post('/lost', async (req, res) => {
    try{
    var description= ""
    var title= ""
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
      }
     description=fields.description
     title=fields.title
     var oldPath = files.selectedFile.filepath;
     console.log(oldPath)
     var array=files.selectedFile.originalFilename.split(".");
     var name=files.selectedFile.newFilename+"."+array[array.length-1];
        var newPath = path.join(__dirname, '../uploads')
                + '/'+name
        var rawData = fs.readFileSync(oldPath)
      
        fs.writeFile(newPath, rawData, async function(err){
            if(err) console.log(err)
            await lost.create({
              title:title,
              description:description,
              Img:name,
              accepted:'Pending',
              status:'Not found'
          })
          res.json({status:"ok"})
            
        })
    });
    
    
    
  } catch (err){
    res.json({error:err})
    console.log(err)
  }})


  module.exports = router