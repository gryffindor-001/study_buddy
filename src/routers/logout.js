const express = require('express')
const request = require('request')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/logout', auth, (req, res) => {
    request.post({
        url: 'https://yug-task-manager.herokuapp.com/users/logout',
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json: true
    }, (error, response) => {
        res.redirect('/')
    })
})

module.exports = router