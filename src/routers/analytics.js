const request = require('async-request')
const express = require('express')
const auth = require('../middleware/auth')
const { response } = require('express')
const { max } = require('moment')

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
        let rating = await request("https://codeforces.com/api/user.rating?handle=" + handle)
        rating = JSON.parse(rating.body)

        if(handle!="@@@@"&&(user.status=="FAILED"||status.status=="FAILED"))
        throw new Error("NOT found")

        let profile;
        let ratingDis;
        let levelDis;
        let tags;
        let isDefined = false
        if(handle!="@@@@"&&user.status=="OK")
        {   
            // Counting Tried and Solved problems
            let contests = rating.result.length
            let setTried = new Set()
            let setSolved = new Set()

            status.result.forEach((e) => {
                if(e.verdict == 'OK') {
                    setSolved.add(e.problem.name)
                }
                setTried.add(e.problem.name)
            });

            // Counting Single Submission AC
            let oneShotObject = {}
            status.result.forEach((e) => {
                if(e.verdict == 'OK') {
                    oneShotObject[e.problem.name] = 0
                }
            });

            for(const property in oneShotObject) {
                status.result.forEach((e) => {
                    if(e.problem.name == property) {
                        oneShotObject[property] = oneShotObject[property] + 1 
                    }
                });
            }

            let oneShot = 0
            for(const property in oneShotObject) {
                if(oneShotObject[property] == 1) {
                    oneShot++
                }
            }

            // Best and Worst Rank and Max and Min rating change
            let maxRank = 0
            let minRank = Infinity
            let maxUp = 0
            let maxDown = 0
            rating.result.forEach((e) => {
                maxRank = Math.max(maxRank, e.rank)
                minRank = Math.min(minRank, e.rank)
                maxUp = Math.max(maxUp, (e.newRating-e.oldRating))
                maxDown = Math.min(maxDown, (e.newRating-e.oldRating))
            });

            // Rendering Object
            profile={
                rating:user.result[0].rating,
                avatar:user.result[0].avatar,
                rank:user.result[0].rank,
                maxRating:user.result[0].maxRating,
                contests,
                tried: setTried.size,
                solved: setSolved.size,
                oneShot,
                maxRank,
                minRank,
                maxDown,
                maxUp
            }

            // Rendering Object number 2
            ratingDis = {}

            // Counting Rating of each Problem
            status.result.forEach((e) => {
                if(e.verdict == 'OK' && e.problem.rating != undefined) {
                    if(ratingDis[e.problem.rating] == undefined) {
                        ratingDis[e.problem.rating] = new Set()
                        ratingDis[e.problem.rating].add(e.problem.name)
                    }
                    else {
                        ratingDis[e.problem.rating].add(e.problem.name)
                    }
                }
            });

            for(const property in ratingDis) {
                ratingDis[property] = ratingDis[property].size
            }

            // Rendering Object number 3
            levelDis = {}

            // Counting Index of each Problem
            status.result.forEach((e) => {
                if(e.verdict == 'OK' && e.problem.index != undefined) {
                    if(levelDis[e.problem.index] == undefined) {
                        levelDis[e.problem.index] = new Set()
                        levelDis[e.problem.index].add(e.problem.name)
                    }
                    else {
                        levelDis[e.problem.index].add(e.problem.name)
                    }
                }
            });

            for(const property in levelDis) {
                levelDis[property] = levelDis[property].size
            }

            // Rendering Object number 4
            tags = {}

            // Counting Index of each Problem
            status.result.forEach((e) => {
                if(e.verdict == 'OK') {
                    e.problem.tags.forEach((tag) => {
                        if(tags[tag] == undefined) {
                            tags[tag] = new Set()
                            tags[tag].add(e.problem.name)
                        }
                        else {
                            tags[tag].add(e.problem.name)
                        }
                    });
                }
            });

            for(const property in tags) {
                tags[property] = tags[property].size
            }

            isDefined = true
        }

        res.render('analytics', {profile, ratingDis, levelDis, tags, handle, isDefined})
    }
    catch(e){
        console.log(e)
        res.status(404).send()
    }

})

module.exports = router