'use strict'

require('dotenv').configDotenv()
const express = require("express");
const router = require('./routes');
const errorHandler = require('./helpers/errorHandler');

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}))
app.use(router)
app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`App running in port ${port}`)
})
