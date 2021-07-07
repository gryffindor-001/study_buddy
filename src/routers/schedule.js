const express = require('express')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

const router = new express.Router()

function compare(a, b) {
    if (a.startTimeHour < b.startTimeHour) {
      return -1;
    }
    else {
        return 1;
    }
}

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
    startTimeHour: {
        type: Number,
        required: true
    },
    startTimeMin: {
        type: Number,
        required: true
    },
    endTimeHour: {
        type: Number,
        required: true
    },
    endTimeMin: {
        type: Number,
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

    Monday.sort(compare)
    Tuesday.sort(compare)
    Wednesday.sort(compare)
    Thursday.sort(compare)
    Friday.sort(compare)
    Saturday.sort(compare)
    Sunday.sort(compare)

    res.render('schedule', {error: req.query.error, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, isauth: true})
})

router.post('/schedule', auth, async (req, res) => {
    const data = new Schedule({
        description: req.body.description,
        day: req.body.day,
        startTimeHour: parseInt(req.body.start.split(":")[0]),
        startTimeMin: parseInt(req.body.start.split(":")[1]),
        endTimeHour: parseInt(req.body.end.split(":")[0]),
        endTimeMin: parseInt(req.body.end.split(":")[1]),
        importance: req.body.importance,
        user_id: req.user_id

        
    
    })

    let tasks = await Schedule.find({user_id: req.user_id, day: data.day})
    let flag = false

    if(data.startTimeHour > data.endTimeHour) {
        flag = true
    }
    else if(data.startTimeHour == data.endTimeHour && data.startTimeMin > data.endTimeMin) {
        flag = true
    } 
    
    if(data.day == undefined) {
        flag = true
    }

    tasks.forEach((e) => {
        if(data.startTimeHour>e.startTimeHour && data.startTimeHour<e.endTimeHour) {
            flag = true;
        }
        if(data.endTimeHour>e.startTimeHour && data.endTimeHour<e.endTimeHour) {
            flag = true;
        }
        if(data.startTimeHour == e.startTimeHour) {
            if(data.startTimeMin < e.endTimeMin || e.startTimeMin < data.endTimeMin) {
                flag = true;
            }
        }
    });
    
    if(!flag) {
        await data.save()
    }

    res.redirect('/schedule?error=' + flag)
})

module.exports = router