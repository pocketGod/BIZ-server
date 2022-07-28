const express = require('express')
const { User } = require('../models/User')
const _ = require('lodash')
const router = express.Router()

router.get('/', async (req,res)=>{
    try {
        let user = await User.findOne({_id:req.payload.id})
        // console.log(user)
        res.status(200).send(_.pick(user, ['_id', 'name', 'email']))

    } catch (error) {
        res.status(400).send('ERROR in profile')
    }
})


module.exports = router
