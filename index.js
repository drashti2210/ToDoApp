const express = require('express');
const bodyParser = require("body-parser");
const localStorage = require('localStorage');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

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
    res.redirect("/");
});

app.post("/donetask", function (req, res) {
    let tasks = localStorage.getItem("todos");
    const done = req.body.check1
    
    if (tasks === null) {
        taskObj = [];
    } else {
        taskObj = JSON.parse(tasks);
    }

    if (typeof done === "string") {
        let key = taskObj.find((tsk) => tsk.task === done);
        key.isDone = true
    }
    else if(typeof done === "object"){
        for (let i = 0; i < done.length; i++) {
            let ele = taskObj.find((tsk) => tsk.task === done[i]);
            ele.isDone = true
        }
    }
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
    if (typeof toDelete === "string") {
        let k = taskObj.find((tsk) => tsk.task === toDelete);
        taskObj.splice(taskObj.indexOf(k), 1)
    }
    else if(typeof toDelete === "object"){
        for (let i = 0; i < toDelete.length; i++) {
            let ele = taskObj.find((tsk) => tsk.task === toDelete[i]);
            taskObj.splice(taskObj.indexOf(ele), 1)
        }
    }
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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
