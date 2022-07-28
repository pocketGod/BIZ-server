const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const register = require('./routes/register')
const login = require('./routes/login')
const profile = require('./routes/userProfile')
const logger = require('./middlewares/logger')
const bizCard = require('./routes/card')
const auth = require('./middlewares/auth')

const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(logger)
app.use('/api/register', register)
app.use('/api/login', login)
app.use('/api/profile', auth, profile)
app.use('/api/card', auth, bizCard)

app.get('*', (req,res)=>{
    res.status(404).send('No such Endpoint')
})


mongoose.connect(process.env.dbString, {useNewUrlParser: true}).then(()=> console.log('Connected To MongoDB...')).catch(()=> 'Cannot Connet To MongoDB...')

app.listen(PORT, ()=> console.log(`server has started on port: ${PORT}`))