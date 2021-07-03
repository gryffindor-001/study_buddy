const express = require('express')
const moment = require('moment')
const request = require('request')
const auth = require('../middleware/auth')
const router = new express.Router()

router.all('/contests', auth, (req, res) => {
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
        let data = contests.body.filter((e) => e.duration!=0)
        data = data.filter((e) => sites[e.site.split(" ")[0]])
        
        data.forEach((e) => {
            e.start_time = moment(new Date(e.start_time).getTime()).utcOffset("+05:30").format("MMM Do, YYYY  h:mm A")
            e.end_time = moment(new Date(e.end_time).getTime()).utcOffset("+05:30").format("MMM Do, YYYY  h:mm A")
            const temp = moment.duration(e.duration*1000)
            e.duration = `${parseInt(e.duration/(24*3600))} days ${temp.hours()}:${temp.minutes()}:${temp.seconds()}`
        });
        res.render('contests', {data, sites, isauth: true})
    })
})

module.exports = router