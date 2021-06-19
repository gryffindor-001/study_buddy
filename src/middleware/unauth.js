const request = require('request')
const unauth = (req,res,next)=>{

    if(!req.cookies['auth_token'])
    return next()

    request.get('https://yug-task-manager.herokuapp.com/users/me', {
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json: true
    }, (error, response) => {
        if(error)next()
        else if (response.body.error)next()
        else return res.redirect('/')
    })

}

module.exports = unauth