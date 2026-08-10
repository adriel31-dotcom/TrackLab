console.log("Dashboard JS Loaded");

let components = [];

window.onload = () => {

    loadDashboard();

}

async function loadDashboard(){

    try{

        const response = await fetch(FLOWS.DASHBOARD,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({})

        });

        const data = await response.json();

        components = data.components;

        updateStats();

        renderTable(components);

    }

    catch(error){

        console.error(error);

        alert("Unable to load dashboard.");

    }

}

function renderTable(data){

    const tbody = document.getElementById("dashboardBody");

    tbody.innerHTML = "";

    data.forEach(component=>{

        tbody.innerHTML += `

        <tr onclick="openComponent('${component.taskId}')">

            <td>${component.taskId}</td>

            <td>${component.trNumber ?? "-"}</td>

            <td>${component.partDescription}</td>

            <td>${component.assignedLab}</td>

            <td>${getStatusBadge(component.status)}</td>

            <td>${component.currentArea}</td>

        </tr>

        `;

    });

}

function getStatusBadge(status){

    switch(status){

        case "Received":
            return '<span class="badge received">Received</span>';

        case "In Progress":
            return '<span class="badge progress">In Progress</span>';

        case "Waiting":
            return '<span class="badge waiting">Waiting</span>';

        case "Completed":
            return '<span class="badge completed">Completed</span>';

        case "Collected":
            return '<span class="badge collected">Collected</span>';

        default:
            return status;

    }

}

function openComponent(taskId){

    window.location.href =
`${ROUTES.COMPONENT}?taskId=${encodeURIComponent(taskId)}`;

}

function updateStats(){

    document.getElementById("totalCount").textContent =
        components.length;

    document.getElementById("receivedCount").textContent =
        components.filter(c => c.status === "Received").length;

    document.getElementById("testingCount").textContent =
        components.filter(c => c.status === "In Progress").length;

    document.getElementById("completedCount").textContent =
        components.filter(c => c.status === "Completed").length;

}

document
.getElementById("refreshBtn")
.addEventListener("click", () => {

    console.log("Refresh clicked");

    loadDashboard();

});

const searchBox = document.getElementById("search");

searchBox.addEventListener("input", function () {

    const query = this.value.toLowerCase().trim();

    if (!query) {

        renderTable(components);
        return;

    }

    const filtered = components.filter(component =>

        (component.taskId || "")
            .toLowerCase()
            .includes(query)

        ||

        (component.trNumber || "")
            .toLowerCase()
            .includes(query)

        ||

        (component.partDescription || "")
            .toLowerCase()
            .includes(query)

    );

    renderTable(filtered);

});