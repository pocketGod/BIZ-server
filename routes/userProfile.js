const express = require('express')
const { User } = require('../models/User')
const _ = require('lodash')
const router = express.Router()

router.get('/', async (req,res)=>{
    try {
        let user = await User.findById(req.payload.id)
        res.status(200).send(_.pick(user, ['_id', 'name', 'email', 'biz']))

    } catch (error) {
        res.status(400).send('ERROR in profile')
    }
})


module.exports = router
