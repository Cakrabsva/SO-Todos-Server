'use strict'

require('dotenv').configDotenv()
const express = require("express");
const router = require('./routes');
const errorHandler = require('./helpers/errorHandler');
const cors = require('cors')

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(router)
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`App running in port ${port}`)
})
