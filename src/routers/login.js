const express = require('express')
const request = require('request')
const unauth = require('../middleware/unauth')
const router = new express.Router()

router.get('/login', unauth, (req, res)=>{ 
    res.render('login', {error: req.query.error, auth: req.query.auth})
})

router.post('/login', (req, res) => {
    const body = {
        "email": req.body.email,
        "password": req.body.password
    }
    request.post({
        url:'https://yug-task-manager.herokuapp.com/users/login',
        body: body,
        json: true
    }, (error, response)=>{
        if(error) return res.redirect('/login?error=1')
        else if(response.body!=undefined) {
            res.cookie('auth_token', response.body.token)
            return res.redirect('/')
        }
        else return res.redirect('/login?error=1')
    })
})

module.exports = router