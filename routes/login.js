const express = require('express')
const joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/User')

const router = express.Router()

const loginSchema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(5).required()
})

router.post('/', async (req,res)=>{
    try {
        let { error } = loginSchema.validate(req.body)
        if(error) return res.status(400).send(error.message)
        
        let user = await User.findOne({email:req.body.email})
        if(!user) return res.status(400).send('Invalid email or password')

        let result = await bcrypt.compare(req.body.password, user.password)
        if(!result) return res.status(400).send('Invalid email or password')

        let token = jwt.sign({id:user._id, biz:user.biz}, process.env.secretKey)
        
        res.status(200).send({token: token})

    } catch (error) {
        res.status(400).send('ERROR in POST login')
    }
})


module.exports = router
