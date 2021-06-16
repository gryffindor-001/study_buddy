require('./db/mongoose')
const express = require('express')
const request = require('request')
const hbs = require('hbs')
const path = require('path')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))

app.get('/contests', (req, res) => {
    const url = 'https://kontests.net/api/v1/all'
    
    request({
        url,
        json: true
    }, (error, contests) => {
        if(error) {
            return console.log('Errorrrr')
        }

        res.render('contests', {data: contests.body})
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server is up')
})