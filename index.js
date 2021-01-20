const express = require('express');
const bodyParser = require("body-parser");
const localStorage = require('localStorage');
const hbs = require('hbs');
const path = require('path')

const port = process.env.PORT || 3000

const app = express();

const viewPath = path.join(__dirname, './views');
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', viewPath)

app.post('/addtask', function (req, res) {
    let tasks = localStorage.getItem("todos");
    let duplicate;
    const newTask = req.body.newtask;

    if (tasks === null) {
        taskObj = [];
        duplicate = false;
    } else {
        taskObj = JSON.parse(tasks);
        duplicate = taskObj.find((tsk) => tsk.task === newTask)
    }
    if (!duplicate) {
        let newtsk = {
            isDone: false,
            task: newTask
        }
        taskObj.push(newtsk);
        localStorage.setItem("todos", JSON.stringify(taskObj));
    }
    else {
        console.log("Already added");
    }
    res.redirect('/');
});

app.post('/readdtask', (req, res) => {
    let tasks = localStorage.getItem("todos");
    const undo = req.body.newTsk
    if (tasks === null) {
        taskObj = [];
    } else {
        taskObj = JSON.parse(tasks);
    }
    let key = taskObj.find((tsk) => tsk.task === undo);
    key.isDone = false


    localStorage.setItem("todos", JSON.stringify(taskObj));
    res.redirect("/");
})

app.post("/donetask", function (req, res) {
    let tasks = localStorage.getItem("todos");
    const done = req.body.check1

    if (tasks === null) {
        taskObj = [];
    } else {
        taskObj = JSON.parse(tasks);
    }

    let key = taskObj.find((tsk) => tsk.task === done);
    key.isDone = true

    localStorage.setItem("todos", JSON.stringify(taskObj));
    res.redirect("/");
});

app.post("/deletetask", function (req, res) {
    let tasks = localStorage.getItem("todos");
    const toDelete = req.body.check
    // let taskToKeep;
    if (tasks === null) {
        taskObj = [];
    } else {
        taskObj = JSON.parse(tasks);
    }
    console.log(toDelete)

    let k = taskObj.find((tsk) => tsk.task === toDelete);
    taskObj.splice(taskObj.indexOf(k), 1)

    localStorage.setItem("todos", JSON.stringify(taskObj));
    res.redirect("/");
})

app.get("/", function (req, res) {
    tasks = localStorage.getItem("todos")
    if (tasks === null) {
        todo = []
    }
    else {
        todo = JSON.parse(tasks)
    }
    mytask = []
    completed = []
    for (var i = 0; i < todo.length; i++) {
        if (todo[i].isDone == false) {
            mytask.push(todo[i].task)
        }
        else {
            completed.push(todo[i].task)
        }
    }
    res.render("index", { task: mytask, completed: completed });
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}`)
});
