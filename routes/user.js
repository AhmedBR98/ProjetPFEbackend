const express = require('express')
const router = express.Router()
const user = require ('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const JWT_EXPIRATION_NUM = process.env.JWT_EXPIRATION_NUM;
const NODE_ENV = process.env.NODE_ENV;
const request = require('superagent');


// define the home page route
router.get('/', (req, res) => {
  res.send('Users homepage')
})

// define the about route
router.post('/register', async (req, res) => {
  try{
    const newPassword = await bcrypt.hash(req.body.password, 10)
  var fname=req.body.fname;
  var lname=req.body.lname;
  var email=req.body.email;
  var pnumber=req.body.pnumber;
  var birthdate=req.body.value;
  var gender=req.body.gender;
  var password=newPassword;
  const newUser = {
    fname , email , password
    }
    // const activation_token = createActivationToken (newUser)
    
    // const url='http://localhost:8000/user/activate/${activation_token}'
  await user.create({

   fname:fname,
   lname:lname,
   email:email,
   pnumber:pnumber,
   password:password,
   birthdate:birthdate,
   gender:gender,
   type:'user',
  //  isVerified:false,
  //  verificationToke:activation_token
  })
  res.json({status:"ok"})
} catch (err){
  res.json({error:err})
  console.log(err)
}

})


// const createActivationToken = (payload) => {
//   return jwt.sign(payload , process.env.ACTIVATION_TOKEN_SECRET, {expiresIn:'15m'} )
// }
router.post('/facebook',async(req,res)=>{
  try{
const findUser=await user.findOne({
  email:req.body.email
});
if(!findUser){
  await user.create({

    fname:req.body.fname,
    lname:req.body.lname,
    email:req.body.email,
    accountType:'Facebook',
    birthdate:req.body.birthday,
    gender:req.body.gender,
    type:'user',
   //  isVerified:false,
   //  verificationToke:activation_token
   })
   const token = jwt.sign(
    {
      //  fname: finduser.fname,
      email: req.body.email,
      type: 'user',
    },
     'secret123'
  )

   return res.json({ status: 'ok', user: token })
}
else{
  if(findUser.accountType=='Facebook'){
    const token = jwt.sign(
			{
				//  fname: finduser.fname,
				email: findUser.email,
        type: findUser.type,
			},
			 'secret123'
		)

		 return res.json({ status: 'ok', user: token })
  }
  else{
      return res.json({err:'Account with the same Email address has already been created'});
  }
}}catch(err){
  console.log(err);
  return res.json({err:err});
}



})

router.post('/linkedin',async(req,res)=>{
  try{
const findUser=await user.findOne({
  email:req.body.email
});
if(!findUser){
  await user.create({

    fname:req.body.fname,
    lname:req.body.lname,
    email:req.body.email,
    accountType:'Linkedin',
    type:'user',
   })
   const token = jwt.sign(
    {
      email: req.body.email,
      type: 'user',
    },
     'secret123'
  )

   return res.json({ status: 'ok', user: token })
}
else{
  if(findUser.accountType=='Linkedin'){
    const token = jwt.sign(
			{
				email: findUser.email,
        type: findUser.type,
			},
			 'secret123'
		)

		 return res.json({ status: 'ok', user: token })
  }
  else{
      return res.json({err:'Account with the same Email address has already been created'});
  }
}}catch(err){
  console.log(err);
  return res.json({err:err});
}



})


router.post('/login', async (req, res) => {

  const finduser = await user.findOne({
		email: req.body.email,
	})

	if (!finduser) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		finduser.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				//  fname: finduser.fname,
				email: finduser.email,
        type: finduser.type,
			},
			 'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} 
  else {
		return res.json({ status: 'error', user: false })
	}

})


router.post('/details' , async (req , res) => {
const code= req.body.code;
const state=req.body.state;
requestAccessToken(code,state)
.then((response) => {
  requestProfile(response.body.access_token)
  .then(async (response) => {
    console.log(response.body)
    try{
     const findUser=await user.findOne({
        email:response.body.mail
      });
      if(!findUser){
        await user.create({
      
          fname:response.body.localizedFirstName,
          lname:response.body.localizedLastName,
          email:response.body.mail,
          accountType:'Linkedin',
          type:'user',
         })
         const token = jwt.sign(
          {
            email: response.body.mail,
            type: 'user',
          },
           'secret123'
        )
      
         return res.json({ status: 'ok', user: token })
      }
      else{
        if(findUser.accountType=='Linkedin'){
          const token = jwt.sign(
            {
              email: findUser.email,
              type: findUser.type,
            },
             'secret123'
          )
      
           return res.json({ status: 'ok', user: token })
        }
        else{
            return res.json({err:'Account with the same Email address has already been created'});
        }
      }}catch(err){
        console.log(err);
        return res.json({err:err});
      }


    // res.json({ profile: response.body});
  })
})
.catch((error) => {
  res.status(500).send(`${error}`)
  console.error(error)
})
})
function requestAccessToken(code,state) {
  return request.post('https://www.linkedin.com/oauth/v2/accessToken')
    .send('grant_type=authorization_code')
    .send(`redirect_uri=http://localhost:3000/authenticate/linkedin/`)
    .send(`client_id=78avrcsql0ehpx`)
    .send(`client_secret=XynXqULVjgZIhNwx`)
    .send(`code=${code}`)
    .send(`state=${state}`)
}

async function  requestProfile(token) {
  const profil=await request.get('https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName)')
  .set('Authorization', `Bearer ${token}`);
  const mail=await request.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))')
  .set('Authorization', `Bearer ${token}`);
  profil.body.mail=mail.body.elements[0]['handle~'].emailAddress
  return profil
}


// router.get('/logout', async (req, res) => {
//   const options = {
//     expires: new Date(Date.now() + 10000),
//     secure: NODE_ENV === "prodution" ? true : false,
//     httpOnly: NODE_ENV === "production" ? true : false,
//   };
//   res.cookie("jwt", "expiredtoken", options);
//   res.status(200).json({ status: "success" });

// })

module.exports = router