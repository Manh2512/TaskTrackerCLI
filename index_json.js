/* To do list task CLI with json files */
const fs = require('fs'); //working with file system

const args = process.argv; //accessing argument
//argument often having the form: node ~/index.js arg1 arg2 ..

const cwd = args[1].slice(0, -13);
//get the file path of current working directory by removing index.js string

//create todo.json and done.json if it doesn't exist
if(!fs.existsSync(cwd+'todo.json')){
    const data = {
        "Task": [],
        "Created": [],
        "Status": []
    };
    const json_data = JSON.stringify(data, null, 2);

    fs.writeFile(cwd+'todo.json', json_data, (err)=>{
        if(err){    console.error("Error creating file:", err);}
        else{
            console.log("New todo list created!");
        }
    });
}
if(!fs.existsSync(cwd+'done.json')){
    const data = {
        "Task": [],
        "Created": [],
        "Finished": []
    };
    const json_data = JSON.stringify(data, null, 2);

    fs.writeFile(cwd+'done.json', json_data, (err)=>{
        if(err){    console.error("Error creating file:", err);}
        else{
            console.log("New done list created!");
        }
    });
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
    let data = {};

    const fileData = fs.readFileSync(cwd + filename, "utf-8");
    data = JSON.parse(fileData); //parse into object

    let n = data["Task"].length;
    if (n === 0){
        if(filename === 'todo.json'){ console.log("Nothing to do!");}
        else{ console.log("Nothing has been done!");}
        return n;
    }

    //display text
    console.table(data);

    return n;
}

function addFunction(){
    const newTask = args[3];

    if(newTask) {
        const fileJSON = fs.readFileSync(cwd + 'todo.json', "utf-8"); //a string
        //parse data to an object
        let todo = JSON.parse(fileJSON);
        //add task
        todo["Task"].push(newTask);
        //add date
        const currentDate = new Date();
        const date = currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getFullYear();
        todo["Created"].push(date);
        todo["Status"].push("Pending");
        //write data, use callback function to handle error and logs success
        fs.writeFile(cwd + 'todo.json', JSON.stringify(todo, null, 2),
            function (err) {
                //error handling
                if (err) throw err;
                console.log('Added todo: "' + newTask + '"');
            }
        );
    }else{
        console.log("No todo added!");
    }
}

//delete a todo
function deleteFunction(){
    const deleteIndex = args[3];
    const fileJSON = fs.readFileSync(cwd + 'todo.json', "utf-8"); //a string
    let todo = JSON.parse(fileJSON);; //parse into array of objects

    let n = todo["Task"].length;
    if (deleteIndex){
        if(deleteIndex >= n || deleteIndex < 0){
            console.log("Error: index doesn't exist!");
        }else{
            //splice in 3 fields
            todo["Task"].splice(deleteIndex, 1);
            todo["Created"].splice(deleteIndex, 1);
            todo["Status"].splice(deleteIndex, 1);
            
            fs.writeFile(
                cwd+"todo.json", JSON.stringify(todo, null, 2),
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
    let todo = {};
    
    const todoData = fs.readFileSync(cwd + 'todo.json', "utf-8");
    todo = JSON.parse(todoData); //parse into array of objects

    //use filter method to remove empty string
    let n = todo["Task"].length;

    //done
    let done = {};

    const doneData = fs.readFileSync(cwd + 'done.json', "utf-8");
    done = JSON.parse(doneData);

    if (doneIndex){
        if(doneIndex >= n || doneIndex < 0){
            console.log("Error: index doesn't exist!");
        }else{
            //delete from todo
            const task = todo["Task"].splice(doneIndex, 1)[0];
            const created = todo["Created"].splice(doneIndex, 1)[0];
            todo["Status"].splice(doneIndex, 1)[0];
            
            fs.writeFile(
                cwd+"todo.json", JSON.stringify(todo, null, 2),
                function (err){
                    if(err) throw err;
                    console.log("Deleted todo #"+doneIndex+"!");
                }
            );
            //write to done
            const currentDate = new Date();
            const date = currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getFullYear();

            done["Task"].unshift(task);
            done["Created"].unshift(created);
            done["Finished"].unshift(date);

            fs.writeFile(
                cwd+"done.json", JSON.stringify(done),
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
        listFunction('todo.json');
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
        let todo = listFunction('todo.json');
        console.log("--> You have "+todo+" tasks to do!");

        console.log("   ~ DONE LIST ~   ");
        let done = listFunction('done.json');
        console.log("--> You have done "+done+" tasks!");
        break;
    }
    default: {
        InfoFunction();
    }
}