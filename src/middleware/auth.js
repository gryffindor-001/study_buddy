const cookieParser = require('cookie-parser')
const request = require('request')
const auth = (req,res,next)=>{
    if(!req.cookies['auth_token'])
    return res.redirect('/login?auth=1')

    request.get('https://yug-task-manager.herokuapp.com/users/me', {
        'auth': {
            'bearer': req.cookies['auth_token']
        },
        json: true
    }, (error, response) => {
        if(error)return res.redirect('/login?auth=1')
        else if (!response.body.error){
            req.user_id=response.body._id,
            req.user_name = response.body.name,
            next()
        }
        else return res.redirect('/login?auth=1')
    })

}

module.exports = auth