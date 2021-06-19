require('./db/mongoose')
const express = require('express')
const request = require('request')
const hbs = require('hbs')
const path = require('path')
const moment = require('moment')
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')
const unauth = require('./middleware/unauth')

const { duration } = require('moment')
const { on } = require('events')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

app.get('', auth,(req, res) => {
    res.render('index')
})

app.all('/contests', auth,(req, res) => {
    const url = 'https://kontests.net/api/v1/all'
    
    request({
        url,
        json: true
    }, (error, contests) => {
        if(error) {
            return console.log('Errorrrr')
        }
        const sites = {
            'CodeChef': true,
            'HackerEarth': true,
            'CodeForces': true,
            'AtCoder': true,
            'LeetCode': true,
            'TopCoder': true,
            'Kick': true,
            'HackerRank': true
        }
        
        if(req.method == 'POST') {
            for(const property in sites) {
                if(req.body[property]!='on') {
                    sites[property] = false
                }
            }
        }
        let data = contests.body.filter((e)=>e.duration!=0)
        data = data.filter((e)=>sites[e.site.split(" ")[0]])
        
        data.forEach(e => {
            e.start_time = moment(new Date(e.start_time).getTime()).utcOffset("+05:30").format("MMM Do, YYYY  h:mm A")
            e.end_time = moment(new Date(e.end_time).getTime()).utcOffset("+05:30").format("MMM Do, YYYY  h:mm A")
            const temp = moment.duration(e.duration*1000)
            e.duration = `${parseInt(e.duration/(24*3600))}days ${temp.hours()}:${temp.minutes()}:${temp.seconds()}`
        });
        res.render('contests', {data, sites})
    })
})


app.get('/login',unauth,(req,res)=>{ 
    res.render('login',{error:req.query.error,auth:req.query.auth})
})

app.post('/login',(req,res)=>{

    const body = {
        "email":req.body.email,
        "password":req.body.password
    }
    request.post({
        url:'https://yug-task-manager.herokuapp.com/users/login',
        body:body,
        json:true
    },(error,response)=>{
        if(error)return res.redirect('/login?error=1')
        else if(response.body!=undefined)
        {
            res.cookie('auth_token', response.body.token)
            return res.redirect('/')
        }
       
        else return res.redirect('/login?error=1')
    })
})


app.get('/register',unauth,(req,res)=>{
    res.render('register',{
        error:req.query.error,
        inv:req.query.inv,
        mail:req.query.mail
    })
})

app.post('/register',(req,res)=>{

    const body = {
        "email":req.body.email,
        "password":req.body.password,
        "name":req.body.name
    }
    request.post({
        url:'https://yug-task-manager.herokuapp.com/users',
        body:body,
        json:true
    },(error,response)=>{
        if(error)return res.redirect('/register?error=1')
        else if(response.body!=undefined)
        {
            if(response.body.errors)return res.redirect('/register?inv=1')
            if(response.body.keyValue)return res.redirect('/register?mail=1')
            res.cookie('auth_token', response.body.token)
            return res.redirect('/')
        }
       
        else return res.redirect('/register?error=1')
    })
})

app.get('/logout',auth,(req,res)=>{
    request.post({
        url:'https://yug-task-manager.herokuapp.com/users/logout',
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json:true
    },(error,response)=>{
        res.redirect('/')
    })
})

app.get('/todo',auth,(req,res)=>{
    res.send('TODOS')
})

app.listen(process.env.PORT, () => {
    console.log('Server is up')
})