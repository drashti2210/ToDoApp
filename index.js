const express = require('express');
const bodyParser = require("body-parser");
const localStorage = require('localStorage');
const hbs = require('hbs');
const path = require('path')
const mongoose = require('mongoose')
const Task = require('./models/task')
const taskRouter = require('./router')

mongoose.connect('mongodb://127.0.0.1:27017/ToDo-App', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
const port = process.env.PORT || 3000
const app = express();
const viewPath = path.join(__dirname, './views');
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', viewPath)
app.use(express.json())
app.use(taskRouter)

app.post('/addtask', async (req, res) => {

    const task = new Task()
    const newTask = req.body.newtask
    task.description = newTask

    try {
        await task.save()
        res.redirect('/')
    } catch (e) {
        console.log('Error occured')
        res.status(400).send(`Error occured ${e}`)
    }
});

app.post('/readdtask', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate({"description": req.body.newTsk},{"isDone":false})
        if (!task) {
            return res.status(404).send()
        }
    } catch (e) {
        res.status(400).send(e)
    }
    res.redirect("/");
})

app.post("/donetask", async (req, res) => {
    
    try {
        const task = await Task.findOneAndUpdate({"description": req.body.check1},{"isDone":true})
        if (!task) {
            return res.status(404).send()
        }
    } catch (e) {
        res.status(400).send(e)
    }
    res.redirect("/");
});

app.post("/deletetask", async (req, res) =>{
    const toDelete = req.body.check
    try {
        const dum =await Task.findOneAndDelete({"description":toDelete})
        if (!dum) {
            res.status(404).send()
        }
        res.redirect('/')
    } catch (e) {
        res.status(500).send()
    }
})

app.get("/", async (req, res) => {
    
    try {
        const tasks = await Task.find({})
        mytask = []
        completed = []
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].isDone == false) {
                mytask.push(tasks[i].description)
            }
            else {
                completed.push(tasks[i].description)
            }
        }
        res.render("index", { task: mytask, completed: completed });
        
    } catch (e) {
        res.status(500).send()
    }
 });

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
});
