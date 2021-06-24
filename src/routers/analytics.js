const request = require('async-request')
const express = require('express')
const auth = require('../middleware/auth')
const { response } = require('express')

const router = new express.Router()


router.all('/analytics',auth,async(req,res)=>{
    let handle="@@@@";
    if(req.method == "POST")
    {
        handle = req.body.handle
    }
    if(handle == 'pigmeister' || handle == 'notapig')
    return res.send("abe chl")

    try{
        let user = await request("https://codeforces.com/api/user.info?handles=" + handle)
        user = JSON.parse(user.body)
        let status = await request("https://codeforces.com/api/user.status?handle=" + handle)
        status = JSON.parse(status.body)

        if(handle!="@@@@"&&(user.status=="FAILED"||status.status=="FAILED"))
        throw new Error("NOT found")

        let profile;
        let isDefined = false
        if(handle!="@@@@"&&user.status=="OK")
        {
            profile={
                rating:user.result[0].rating,
                avatar:user.result[0].avatar,
                rank:user.result[0].rank,
                maxRating:user.result[0].maxRating
            }
            isDefined = true
        }

        res.render('analytics', {profile, isDefined})
    }
    catch(e){
        res.status(404).send()
    }

})

module.exports = router