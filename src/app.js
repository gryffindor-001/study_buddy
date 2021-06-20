require('./db/mongoose')
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')
const contestRouter = require('./routers/contests')
const loginRouter = require('./routers/login')
const registerRouter = require('./routers/register')
const logoutRouter = require('./routers/logout')
const todoRouter = require('./routers/todo')

const app = express()

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(contestRouter)
app.use(loginRouter)
app.use(registerRouter)
app.use(logoutRouter)
app.use(todoRouter)

hbs.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

app.get('', auth, (req, res) => {
    res.render('index')
})

app.listen(process.env.PORT, () => {
    console.log('Server is up')
})