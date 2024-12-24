/* To do list task with the help of GFG */
const fs = require('fs'); //working with file system

const args = process.argv; //accessing argument
//argument often having the form: node ~/index.js arg1 arg2 ..

const cwd = args[1].slice(0, -8);
//get the file path of current working directory by removing index.js string

//create todo.txt and done.txt if it doesn't exist
if(fs.existsSync(cwd+'todo.txt')){
    let createStream = fs.createWriteStream('todo.txt');
    createStream.end();
}
if(fs.existsSync(cwd+'done.txt')){
    let createStream = fs.createWriteStream('done.txt');
    createStream.end();
}

//help function
function InfoFunction(){
    const UsageText = `
    Usage :-
    $ node index.js add "todo item" # Add a new todo
    $ node index.js ls              # Show remaining todos
    $ node index.js del NUMBER      # Delete a todo
    $ node index.js done NUMBER     # Complete a todo
    $ node index.js help            # Show usage
    $ node index.js report          # Statistics
    `;
    console.log(UsageText);
}

//read data from filename and display
function listFunction(filename){
    let data = [];

    const fileData = fs.readFileSync(cwd + filename).toString();
    data = fileData.split("\n"); //split the list into array of strings

    //use filter method to remove empty string
    let filteredData = data.filter(function (value) { return value !== ''});
    let n = filteredData.length;
    if (n === 0){
        if(filename === 'todo.txt'){ console.log("Nothing to do!");}
        else{ console.log("Nothing has been done!");}
    }

    //display text
    for (let i=0; i<n; i++){
        console.log((n - i) + '. ' + filteredData[i]);
    }

    return n;
}

function addFunction(){
    const newTask = args[3];

    if(newTask) {
        const fileData = fs.readFileSync(cwd + 'todo.txt').toString();

        //write data, use callback function to handle error and logs success
        fs.writeFile(cwd + 'todo.txt', newTask + '\n' + fileData,
            function (err) {
                //error handling
                if (err) throw err;
                console.log('Added todo: "' + newTask + '"');
            }
        );
    }else{
        console.log("No todo added!");
        const fileData = fs.readFileSync(cwd + 'todo.txt').toString();
    }
}

//delete a todo
function deleteFunction(){
    const deleteIndex = args[3];
    let data = [];
    const fileData = fs.readFileSync(cwd + 'todo.txt').toString();
    data = fileData.split("\n"); //split the list into array of strings

    //use filter method to remove empty string
    let filteredData = data.filter(function (value) { return value !== ''});
    let n = filteredData.length;
    if (deleteIndex){
        if(deleteIndex > n || deleteIndex <= 0){
            console.log("Error: index doesn't exist!");
        }else{
            filteredData.splice(n-deleteIndex, 1);
            const newData = filteredData.join("\n");
            fs.writeFile(
                cwd+"todo.txt", newData,
                function (err){
                    if(err) throw err;
                    console.log("Deleted todo #"+deleteIndex+"!");
                }
            );
        }
    }else{
        console.log("No argument passed!");
    }
}

//move a task from todo to done
function doneFunction(){
    const doneIndex = args[3];

    //todo
    let todo_data = [];
    
    const todoData = fs.readFileSync(cwd + 'todo.txt').toString();
    todo_data = todoData.split("\n"); //split the list into array of strings

    //use filter method to remove empty string
    let todo_filteredData = todo_data.filter(function (value) { return value !== ''});
    let n = todo_filteredData.length;

    //done
    const doneData = fs.readFileSync(cwd + 'done.txt').toString();

    if (doneIndex){
        if(doneIndex > n || doneIndex <= 0){
            console.log("Error: index doesn't exist!");
        }else{
            let done = filteredData.splice(n-doneIndex, 1)[0];
            const newData = filteredData.join("\n");
            fs.writeFile(
                cwd+"todo.txt", newData,
                function (err){
                    if(err) throw err;
                    console.log("Deleted todo #"+doneIndex+"!");
                }
            );

            fs.writeFile(
                cwd+"done.txt", doneData+"x "+done+"\n",
                function (err){
                    if(err) throw err;
                    console.log("Added done #"+doneIndex+"!");
                }
            );
        }
    }else{
        console.log("No argument passed!");
    }
}

switch (args[2]) {
    case 'add' : {
        addFunction();
        break;
    }
    case 'ls': {
        console.log("   ~ TODO LIST ~   ");
        listFunction('todo.txt');
        break;
    }
    case 'del': {
        deleteFunction();
        break;
    }
    case 'done': {
        doneFunction();
        break;
    }
    case 'help': {
        InfoFunction();
        break;
    }
    case 'report': {
        console.log("   ~ TODO LIST ~   ");
        let todo = listFunction('todo.txt');
        console.log("--> You have "+todo+" tasks to do!");

        console.log("   ~ DONE LIST ~   ");
        let done = listFunction('done.txt');
        console.log("--> You have done "+done+" tasks!");
    }
    default: {
        InfoFunction();
    }
}