require('./db/mongoose')
const express = require('express')
const request = require('request')
const hbs = require('hbs')
const path = require('path')
const moment = require('moment')

const { duration } = require('moment')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: false }))

hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

app.get('', (req, res) => {
    res.render('index')
})

app.all('/contests',(req,res,next)=>{
    if(req.method==="POST")
    req.hasData=true;

    req.method="GET"
    next()
})

app.get('/contests', (req, res) => {
    const url = 'https://kontests.net/api/v1/all'
    
    request({
        url,
        json: true
    }, (error, contests) => {
        if(error) {
            return console.log('Errorrrr')
        }
        let data = contests.body.filter((e)=>e.duration!=0)
        if(req.hasData)
        data = data.filter((e)=>req.body[e.site]=='on')
        
        data.forEach(e => {
            e.start_time = moment(new Date(e.start_time).getTime()).format("MMM Do, YYYY  h:mm A")
            e.end_time = moment(new Date(e.end_time).getTime()).format("MMM Do, YYYY  h:mm A")
            const temp = moment.duration(e.duration*1000)
            e.duration = `${parseInt(e.duration/(24*3600))}days ${temp.hours()}:${temp.minutes()}:${temp.seconds()}`
        });
        res.render('contests', {data})
    })
})

app.listen(process.env.PORT, () => {
    console.log('Server is up')
})