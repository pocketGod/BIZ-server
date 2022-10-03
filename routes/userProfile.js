const express = require('express')
const { User } = require('../models/User')
const _ = require('lodash')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/', async (req,res)=>{
    try {
        let user = await User.findById(req.payload.id)
        res.status(200).send(_.pick(user, ['_id', 'name', 'email', 'biz']))

    } catch (error) {
        res.status(400).send('ERROR in get my profile')
    }
})

router.get('/other-user/:id', async (req,res)=>{
    try {
        let user = await User.findById(req.params.id)
        if(!user) return res.status(400).send('No such User in DB')
        res.status(200).send(_.pick(user, ['name', 'email']))

    } catch (error) {
        res.status(400).send('ERROR in get other users profile')
    }
})

router.get('/change-biz/:id', async (req,res)=>{
    try {
        let user = await User.findById(req.params.id)
        if(!user) return res.status(400).send('No such User in DB')
        user.biz = true

        let newUser = await User.findOneAndUpdate({_id: req.payload.id}, user, {new:true})
        if(!newUser) return res.status(400).send('No such User in DB')

        await newUser.save()

        let token = jwt.sign({id:newUser._id, biz:newUser.biz}, process.env.secretKey)

        res.status(200).send({user:_.pick(user, ['name', 'email', 'biz', '_id']), newToken:token})

    } catch (error) {
        res.status(400).send(`ERROR in changing biz to true for user`)
    }
})


module.exports = router
