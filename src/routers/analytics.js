const request = require('request')
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
    if(handle == 'pigmeister')
    return res.send("abe chl")

    try{
        const user = await request({
            url: "https://codeforces.com/api/user.info?handles=" + handle,
            json: true
        })
        const status = await request({
            url: "https://codeforces.com/api/user.status?handle=" + handle,
            json: true
        })

        if(handle!="@@@@"&&(user.body.status=="FAILED"||status.body.status=="FAILED"))
        throw new Error("NOT found")

        let profile;
        if(user.body.status=="OK")
        {
            profile={
                rating:user.body.result[0].rating,
                avatar:user.body.result[0].avatar,
                rank:user.body.result[0].rank,
                maxRating:user.body.result[0].maxRating
            }
        }

        res.render('analytics')
    }
    catch(e){
        res.status(404).send()
    }

})

module.exports = router