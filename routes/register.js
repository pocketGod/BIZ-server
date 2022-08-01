const express = require('express')
const bcrypt = require('bcrypt')
const joi = require('joi')
const _ = require('lodash')
const { User } = require('../models/User')
const jwt = require('jsonwebtoken')
const router = express.Router()


const registerScheme = joi.object({
    name: joi.string().required().min(2),
    email: joi.string().required().min(6).email(),
    password: joi.string().required().min(5),
    biz: joi.boolean().required()
})


router.post('/', async(req,res)=>{
    try {
        let { error } = registerScheme.validate(req.body)
        if(error) return res.status(400).send(error.message)

        let user = await User.findOne({email:req.body.email})
        if(user) return res.status(400).send('user already exists...')

        user = new User(req.body)

        let salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()

        let token = jwt.sign({id:user._id, biz:user.biz}, process.env.secretKey)

        res.status(201).send({info: _.pick(user, ['_id', 'name', 'email', 'biz']), token: token})

    } catch (error) {
        res.status(400).send('ERROR in POST user')
    }
})




module.exports = router
