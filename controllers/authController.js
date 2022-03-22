const express = require('express')
const router = express.Router()
const user = require ('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const user = require("../routes/user");
const { options } = require('../routes/user')

exports.logout_get = async (req , res) => {
    res.cookie('jwt' , '' , {maxAge: 1});
    res.redirect('/Login');
}