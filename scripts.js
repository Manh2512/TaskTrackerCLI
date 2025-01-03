const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(currentDate.getDate()).padStart(2, '0');

const date =`${year}-${month}-${day}`; // Example: 2025-01-02

function displayTable(jsonFile){
    //display json file as table
    //json file is array of objects
    let table = document.getElementById("todo-list").querySelector("tbody");
    jsonFile.forEach((row, i) => {
        const tableRow = document.createElement('tr');

        // Create a cell for each value in the JSON object
        const id = document.createElement('td');
        id.setAttribute("class", "index");
        id.textContent = i+1;
        tableRow.appendChild(id);

        //create task
        const task_cell = document.createElement('td');
        task_cell.setAttribute("class", "task");
        task_cell.textContent = row["task"];

        const date_cell = document.createElement('td');
        date_cell.setAttribute("class", "created-at");
        date_cell.textContent = row["date"];

        const status_cell = document.createElement('td');
        status_cell.setAttribute("class", "status");
        status_cell.textContent = row["status"];
        /*
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tableRow.appendChild(td);
        });
        */
        tableRow.appendChild(task_cell);
        tableRow.appendChild(date_cell);
        tableRow.appendChild(status_cell);

        // Append the row to the table
        table.appendChild(tableRow);
    });
}

document.getElementById("myForm").addEventListener("submit", async function(event){
    event.preventDefault();
    const data = {
        "act": document.getElementById("action-choose").value,
        "task": document.getElementById("reply").value,
        "date": date,
        "status": "Pending"
    };
    try {
        const response = await fetch('/submit', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if(response.ok){
            alert("Data submitted successfully");
        }else{
            alert("Error occured when submitting");
        }
    }catch(error){
        console.error("Error: ", error);
        alert("Error submitting data");
    }
    location.reload(); //refresh the page
});

fetch('/data')
    .then(response => response.json())
    .then(data => {
        //data is json
        // Select the div element
        displayTable(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));