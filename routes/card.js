const express = require('express')
const { User } = require('../models/User')
const { Card } = require('../models/Card')
const _ = require('lodash')
const joi = require('joi')


const router = express.Router()


const cardSchema = joi.object({
    name: joi.string().required().min(2),
    description: joi.string().required().min(6),
    address: joi.string().required().min(3),
    phone: joi.string().required().min(8).regex(/^\+?(972\-?)?0?(([23489]{1}\-?\d{7})|[5]{1}\d{1}\-?\d{7})$/),
    img: joi.string().required()
})


const generateRandomID = async ()=>{
    let ID = _.random(1000, 999999)
    let bizCard = await Card.findOne({card_id:ID})

    if(bizCard) generateRandomID()
    else return ID
}

router.post('/', async (req,res)=>{
    try {
        let {error} = cardSchema.validate(req.body)
        if(error) return res.status(400).send(error.message)

        let bizCard = new Card(req.body)
        bizCard.card_id = await generateRandomID()

        
        bizCard.user_id = req.payload.id

        await bizCard.save()
        
        res.status(200).send(_.pick(bizCard, ['card_id', 'user_id', 'name', 'description', 'address', 'phone', 'img']))


    } catch (error) {
        res.status(400).send('ERROR in POST a new card')
    }
})


router.get('/my-cards', async (req,res)=>{
    try {
        let cards = await Card.find({user_id:req.payload.id})
        if(cards.length == 0) return res.status(400).send('No Cards Under This UserID')

        res.status(200).send(cards)
    } catch (error) {
        res.status(400).send('ERROR in GET a card via userID')
    }
})


router.get('/:card_id', async (req,res)=>{
    try {
        let card = await Card.findOne({_id: req.params.card_id, user_id:req.payload.id})
        if(!card) return res.status(400).send('No such card in DB')

        res.status(200).send(card)

    } catch (error) {
        res.status(400).send('ERROR in GET a specific card')
    }
})


router.put('/:card_id', async (req,res)=>{
    try {
        let {error} = cardSchema.validate(req.body)
        if(error) return res.status(400).send(error.message)

        let card = await Card.findOneAndUpdate({_id: req.params.card_id, user_id:req.payload.id}, req.body, {new:true})

        if(!card) return res.status(400).send('No such card in DB')

        res.status(200).send(card)

    } catch (error) {
        res.status(400).send('ERROR in PUT a specific card')
    }
})

router.delete('/:card_id', async (req,res)=>{
    try {
        let card = await Card.findOneAndRemove({_id: req.params.card_id,  user_id:req.payload.id})
        if(!card) return res.status(400).send('No such card in DB')

        res.status(200).send(`Card ${req.params.card_id} Was Deleted`)

    } catch (error) {
        res.status(400).send('ERROR in DELETE a specific card')
    }
})


router.get('/', async (req,res)=>{
    try {
        let cards = await Card.find()
        if(cards.length == 0) return res.status(400).send('No Cards in DB')

        res.status(200).send(cards)
    } catch (error) {
        res.status(400).send('ERROR in GET all cards')
    }
})





module.exports = router
