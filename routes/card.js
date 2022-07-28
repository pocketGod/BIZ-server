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
    phone: joi.string().required().min(8),
    img: joi.string().required()
})


const generateRandomID = async ()=>{
    let ID = _.random(10, 1000)
    let bizCard = await Card.findOne({card_id:ID})

    // if card_id already exists generate again
    if(bizCard) generateRandomID()
    else return ID
}

router.post('/', async (req,res)=>{
    try {
        let {error} = cardSchema.validate(req.body)
        if(error) return res.status(400).send(error.message)

        let bizCard = await Card.findOne({name: req.body.name})
        if(bizCard) return res.status(400).send('bizCard already exists...')

        bizCard = new Card(req.body)
        bizCard.card_id = await generateRandomID()

        let user = await User.findOne({_id:req.payload.id})
        bizCard.user_id = user._id

        await bizCard.save()
        
        res.status(200).send(_.pick(bizCard, ['card_id', 'user_id', 'name', 'description', 'address', 'phone', 'img']))


    } catch (error) {
        res.status(400).send('ERROR in POST a new card')
    }
})

router.get('/all', async (req,res)=>{
    try {
        let cards = await Card.find()
        if(cards.length == 0) return res.status(400).send('No Cards in DB')

        res.status(200).send(cards)
    } catch (error) {
        res.status(400).send('ERROR in GET all cards')
    }
})

router.get('/all/:user_id', async (req,res)=>{
    try {
        let cards = await Card.find({user_id:req.params.user_id})
        if(cards.length == 0) return res.status(400).send('No Cards Under This UserID')

        res.status(200).send(cards)
    } catch (error) {
        res.status(400).send('ERROR in GET a card via userID')
    }
})



router.get('/:card_id', async (req,res)=>{
    try {
        let card = await Card.findOne({card_id: req.params.card_id})
        if(!card) return res.status(400).send('No such card in DB')

        res.status(200).send(card)

    } catch (error) {
        res.status(400).send('ERROR in GET a specific card')
    }
})

router.put('/:card_id', async (req,res)=>{
    try {
        let card = await Card.findOneAndUpdate({card_id: req.params.card_id},{
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            phone: req.body.phone,
            img: req.body.img
         }, {new:true})

        if(!card) return res.status(400).send('No such card in DB')

        res.status(200).send(card)

    } catch (error) {
        res.status(400).send('ERROR in PUT a specific card')
    }
})

router.delete('/:card_id', async (req,res)=>{
    try {
        let card = await Card.findOneAndRemove({card_id: req.params.card_id})
        if(!card) return res.status(400).send('No such card in DB')

        res.status(200).send(`Card ${req.params.card_id} Was Deleted`)

    } catch (error) {
        res.status(400).send('ERROR in DELETE a specific card')
    }
})



module.exports = router
