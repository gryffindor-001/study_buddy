const express = require('express')
const request = require('request')
const unauth = require('../middleware/unauth')
const router = new express.Router()

router.get('/register', unauth, (req, res) => {
    res.render('register', {
        error: req.query.error,
        inv: req.query.inv,
        mail: req.query.mail
    })
})

router.post('/register', (req, res) => {
    const body = {
        "email": req.body.email,
        "password": req.body.password,
        "name": req.body.name
    }
    request.post({
        url: 'https://yug-task-manager.herokuapp.com/users',
        body: body,
        json: true
    }, (error, response) => {
        if(error) return res.redirect('/register?error=1')
        else if(response.body!=undefined) {
            if(response.body.errors) return res.redirect('/register?inv=1')
            if(response.body.keyValue) return res.redirect('/register?mail=1')
            res.cookie('auth_token', response.body.token)
            return res.redirect('/')
        }
        else return res.redirect('/register?error=1')
    })
})

module.exports = router