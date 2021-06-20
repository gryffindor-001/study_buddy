const request = require('request')
const isauth = (req,res,next)=>{

    if(!req.cookies['auth_token']) {
        req.isauth = false
        next()
    }

    request.get('https://yug-task-manager.herokuapp.com/users/me', {
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json: true
    }, (error, response) => {
        if(error) {
            req.isauth = false
            next()
        }
        else if (!response.body.error) {
            req.isauth = true
            next()
        }
        else {
            req.isauth = false
            next()
        }
    })
}

module.exports = isauth