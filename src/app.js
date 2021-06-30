require('./db/mongoose')
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const cookieParser = require('cookie-parser');
const isauth = require('./middleware/isauth')
const contestRouter = require('./routers/contests')
const loginRouter = require('./routers/login')
const registerRouter = require('./routers/register')
const logoutRouter = require('./routers/logout')
const todoRouter = require('./routers/todo')
const analyticsRouter = require('./routers/analytics')
const scheduleRouter = require('./routers/schedule')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
app.use(express.static(path.join(__dirname, '../public')))
hbs.registerPartials(path.join(__dirname,'../templates/partials'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(contestRouter)
app.use(loginRouter)
app.use(registerRouter)
app.use(logoutRouter)
app.use(todoRouter)
app.use(analyticsRouter)
app.use(scheduleRouter)

hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});

app.get('/', isauth, (req, res) => {
    res.render('index', {isauth: req.isauth, notisauth: !req.isauth})
})

app.listen(process.env.PORT, () => {
    console.log('Server is up')
})