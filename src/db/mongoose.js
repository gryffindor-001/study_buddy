const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})