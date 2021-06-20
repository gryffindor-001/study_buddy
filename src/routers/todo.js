const express = require('express')
const moment = require('moment')
const request = require('request')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/todo', auth, (req, res) => {
    res.send('TODOS')
})

module.exports = router