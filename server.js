const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");

const app = express();
const PORT = 3000;

function addFunction(userData){
    let newTask = {
        "task": userData["task"],
        "date": userData["date"],
        "status": userData["status"]
    };
    existingData.push(newTask);
}

function updateFunction(userData){
    const taskIndex = parseInt(userData["task"], 10)-1;
    existingData[taskIndex]["status"] = "Working";
}

function editFunction(userData){
    const regex = /\d+,/;
    const indexString = userData["task"].match(regex)[0];
    const taskIndex = parseInt(indexString.slice(0,-1), 10)-1;
    const editedTask = userData["task"].slice(indexString.length+1, userData["task"].length);
    existingData[taskIndex]["task"] = editedTask;
}

function deleteFunction(userData){
    const taskIndex = parseInt(userData["task"], 10)-1;
    existingData.splice(taskIndex, 1);
}

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "doc.html"));
});

let existingData = [];

app.post("/submit", (req, res) => {
    const userData = req.body;
    const filePath = path.join(__dirname, 'todo.json');
    existingData = [];
    if(fs.existsSync(filePath)){
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(fileContent);
    }
    //processing user data based on action
    switch(userData["act"]){
        case "add": {
            addFunction(userData);
            break;
        }
        case "update": {
            updateFunction(userData);
            break;
        }
        case "delete": {
            deleteFunction(userData);
            break;
        }
        case "edit": {
            editFunction(userData);
            break;
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");
    res.status(200).send({ message: "Data stored successfully!"});
});

app.get('/data', (req, res) => {
    const fileContent = fs.readFileSync(path.join(__dirname, 'todo.json'), "utf-8");
    const existingData = JSON.parse(fileContent);
    res.json(existingData);
});

app.listen(PORT, () => {
    console.log(`Server running on http::localhost:${PORT}`);
});