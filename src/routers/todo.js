const { response } = require('express')
const express = require('express')
const request = require('request')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/todo', auth, (req, res) => {
    const pageNo = req.query.page || 1
    let totalPage = 1
    
    request.get('https://yug-task-manager.herokuapp.com/tasks', {
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json: true
    }, (error, response) => {
        if(error) return res.status(404).send()
        
        totalPage = parseInt(((response.body.length-1)/9)+1)
        request.get('https://yug-task-manager.herokuapp.com/tasks?limit=9&skip=' + (pageNo-1)*9, {
            'auth': {
                'bearer': req.cookies['auth_token']
            },
            json: true
        }, (error, response) => {
            if(error) return res.status(404).send()
        
            res.render('todo', {todos: response.body, page: pageNo, totalPage: totalPage+1})
        })  
    })
})

router.post('/todo', auth, (req, res) => {
    const body = {
        description: req.body.description
    }

    request.post({
        url: 'https://yug-task-manager.herokuapp.com/tasks',
        body: body,
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json: true
    }, (error, response)=>{
        if(error) return res.status(400).send()
        else if(response.body!=undefined) {
            return res.redirect('/todo')
        }
        else return res.redirect('/todo')
    })
})

router.get('/delete', auth, (req, res) => {
    id = req.query.id

    request.delete('https://yug-task-manager.herokuapp.com/tasks/' + id, {
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json: true
    }, (error, response) => {
        res.redirect('/todo')
    })
})

module.exports = router