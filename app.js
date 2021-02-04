const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/ToDo-App', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const taskRouter = require('./router')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(taskRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})