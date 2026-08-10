const API_URL = "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/85f295a4c62841e9a11652eacbf1ac91/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_O3uV2eSdn5Jrf-Sy4ToHK9mPxEF5CpzWEmQZAtL_Ww";

// ==========================
// DOM ELEMENTS
// ==========================

const componentDescription = document.getElementById("componentDescription");
const taskDescription = document.getElementById("taskDescription");
const trNumber = document.getElementById("trNumber");

const assignedLab = document.getElementById("assignedLab");
const currentArea = document.getElementById("currentArea");
const currentZone = document.getElementById("currentZone");

const registeredBy = document.getElementById("registeredBy");
const comments = document.getElementById("comments");

const registerBtn = document.getElementById("registerBtn");

// ==========================
// LAB LOCATIONS
// ==========================

const labLocations = {

    "Materials Lab": [
        "Desiccator (Mounts) Area",
        "Cupboard",
        "Mount Rack",
        "Rack",
        "Cutting Machine Table",
        "Fume Hood",
        "MPI Machine",
        "Mounting Machine Table"
    ],

    "Metrology Lab": [
        "Cupboard",
        "Formtracer Table",
        "3D Scanner Table",
        "CMM Table Storage Area"
    ],

    "General Storage Area": [
        "Storage Shelf"
    ],

    "Teardown Lab": [
        "Inspection Table"
    ]

};

// ==========================
// DYNAMIC LOCATION DROPDOWN
// ==========================

currentArea.addEventListener("change", function () {

    currentZone.innerHTML =
        '<option value="">Select Current Zone</option>';

    const locations = labLocations[this.value];

    if (!locations) return;

    locations.forEach(location => {

        const option = document.createElement("option");

        option.value = location;
        option.textContent = location;

        currentZone.appendChild(option);

    });

});

// ==========================
// REGISTER BUTTON
// ==========================

registerBtn.addEventListener("click", async function () {

    // ======================
    // VALIDATION
    // ======================

    if (componentDescription.value.trim() === "") {
        alert("Please enter the Component Description.");
        return;
    }

    if (taskDescription.value.trim() === "") {
        alert("Please enter the Task Description.");
        return;
    }

    if (trNumber.value.trim() === "") {
        alert("Please enter the Test Request (TR) Number.");
        return;
    }

    if (assignedLab.value === "") {
        alert("Please select the Assigned Lab.");
        return;
    }

    if (currentArea.value === "") {
        alert("Please select the Current Area.");
        return;
    }

    if (currentZone.value === "") {
        alert("Please select the Current Location.");
        return;
    }

    if (registeredBy.value.trim() === "") {
        alert("Please enter your email.");
        return;
    }

    // Basic email validation

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(registeredBy.value.trim())) {
        alert("Please enter a valid email address.");
        return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Registering...";

    // ======================
    // SEND TO POWER AUTOMATE
    // ======================

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                componentDescription: componentDescription.value.trim(),

                taskDescription: taskDescription.value.trim(),

                trNumber: trNumber.value.trim(),

                assignedLab: assignedLab.value,

                currentArea: currentArea.value,

                currentZone: currentZone.value,

                registeredBy: registeredBy.value.trim(),

                comments: comments.value.trim()

            })

        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error(errorText);

            alert("Registration failed.\nHTTP " + response.status);

            return;

        }

        // ======================
        // FUTURE READY
        // ======================
        // Later we'll return:
        //
        // {
        //    success:true,
        //    taskId:"MAT-00021",
        //    qrLink:"..."
        // }
        //
        // For now this still works.

        const result = await response.json();

          if (!result.success) {
          alert("Registration failed.");
          return;
         }

        window.location.href =
        `success.html?taskId=${encodeURIComponent(result.taskId)}&trNumber=${encodeURIComponent(result.trNumber)}`;
        }
    catch (error) {

        console.error(error);

        alert("Unable to connect to the TrackLab server.");

    }

    finally {

        registerBtn.disabled = false;
        registerBtn.textContent = "Register Component";

    }

});
