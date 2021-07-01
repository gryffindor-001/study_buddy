const express = require('express')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

const router = new express.Router()

const tableSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    day: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    importance: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Schedule = mongoose.model('Schedule', tableSchema)

router.get('/schedule', auth, async (req, res) => {
    
    let Monday = await Schedule.find({user_id: req.user_id, day: 'Monday'})
    let Tuesday = await Schedule.find({user_id: req.user_id, day: 'Tuesday'})
    let Wednesday = await Schedule.find({user_id: req.user_id, day: 'Wednesday'})
    let Thursday = await Schedule.find({user_id: req.user_id, day: 'Thursday'})
    let Friday = await Schedule.find({user_id: req.user_id, day: 'Friday'})
    let Saturday = await Schedule.find({user_id: req.user_id, day: 'Saturday'})
    let Sunday = await Schedule.find({user_id: req.user_id, day: 'Sunday'})

    let schedules = {}
    Monday.forEach((e) => {
        if(schedules['Monday'] == undefined) {
            schedules['Monday'] = []
        }
        schedules['Monday'].push(Object.assign({}, e))
        console.log(e)
        console.log('$')
    });

    console.log(schedules)
    res.render('schedule')
})

router.post('/schedule', auth, (req, res) => {
    const data = new Schedule({
        description: req.body.description,
        day: req.body.day,
        startTime: req.body.start,
        endTime: req.body.end,
        importance: req.body.importance,
        user_id: req.user_id
    })
    data.save()
    res.redirect('/schedule')
})

module.exports = router