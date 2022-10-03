const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 2
    },
    description:{
        type: String,
        required: true,
        minlength: 6,
    },
    category:{
        type: String,
        required: true,
        minlength: 2
    },
    address:{
        type: String,
        required: true,
        minlength: 3
    },
    phone:{
        type: String,
        required: true,
        minlength: 8
    },
    img:{
        type: String,
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    card_id:{
        unique: true,
        type: String,
        required: true
    }
})

const Card = mongoose.model('cards', cardSchema)

module.exports = {Card}
