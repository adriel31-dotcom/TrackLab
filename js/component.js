// ======================================================
// TrackLab v2.0
// Component Page
// ======================================================
//
// Author : Adriel Mistry
// Project : TrackLab
//
// Responsibilities
// ----------------
// ✓ Load Component
// ✓ Render Component
// ✓ Update Component
// ✓ Load Movement History
// ✓ Render Movement History
//
// ======================================================



// ======================================================
// GLOBAL VARIABLES
// ======================================================

const params = new URLSearchParams(window.location.search);

const taskId = params.get("trackLabUID") || params.get("taskId");
const trackLabUID = taskId;


// ======================================================
// COMPONENT PAGE OBJECT
// ======================================================

const ComponentPage = {

    component: null,



    // ==================================================
    // INITIALIZE PAGE
    // ==================================================

    async init() {

        if (!taskId) {

        window.location.href = ROUTES.REGISTER;

        return;

    }

        this.attachEvents();

        await this.loadComponent();

        await this.loadMovementHistory();

    },



    // ==================================================
    // ATTACH EVENTS
    // ==================================================

    attachEvents() {

        document
            .getElementById("currentArea")
            .addEventListener("change", (e) => {

                this.populateZones(e.target.value);

            });


        document
            .getElementById("updateBtn")
            .addEventListener("click", () => {

                this.updateComponent();

            });

        document
            .getElementById("printQRBtn")
            .addEventListener("click", () => {

        window.open(

            `qr.html?type=component&id=${encodeURIComponent(taskId)}`,

            "_blank"

        );

    });

    document
    .querySelectorAll('input[name="updateMethod"]')
    .forEach(radio => {

        radio.addEventListener("change", () => {

            const isManual = radio.value === "manual" && radio.checked;

            document.getElementById("manualLocationSection").style.display =
                isManual ? "block" : "none";

            document.getElementById("scanLocationSection").style.display =
                isManual ? "none" : "block";

        });

    });

    },



    // ==================================================
    // POPULATE ZONES
    // ==================================================

    populateZones(lab, selectedZone = "") {

        const dropdown =
            document.getElementById("currentZone");

        dropdown.innerHTML = "";


        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";

        defaultOption.textContent =
            "Select Current Zone";

        dropdown.appendChild(defaultOption);


        if (!LAB_ZONES[lab]) return;


        LAB_ZONES[lab].forEach(zone => {

            const option =
                document.createElement("option");

            option.value = zone;

            option.textContent = zone;

            if (zone === selectedZone) {

                option.selected = true;

            }

            dropdown.appendChild(option);

        });

    },



    // ==================================================
    // LOAD COMPONENT
    // ==================================================

    async loadComponent() {

        try {

            const response =
                await fetch(FLOWS.GET_COMPONENT, {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        trackLabUID: trackLabUID

                    })

                });


            if (!response.ok) {

                throw new Error(
                    await response.text()
                );

            }


            const item =
                await response.json();


            this.component = item;

            this.renderComponent(item);

        }

        catch (err) {

            console.error(err);

            alert(
                "Unable to load component.\n\n"
                + err.message
            );

        }

    },



    // ==================================================
    // RENDER COMPONENT
    // ==================================================

    renderComponent(item) {

        if (!item) {

            alert("Component not found.");

            return;

        }


        document.getElementById("taskId").value =
            item.taskId || "";

        document.getElementById("status").value =
            item.status || "";

        document.getElementById("trNumber").value =
            item.trNumber || "";

        document.getElementById("componentDescription").value =
            item.partDescription || "";

        document.getElementById("requestedTask").value =
            item.requestedTask || "";

        document.getElementById("assignedLab").value =
            item.assignedLab || "";

        document.getElementById("registeredBy").value =
            item.assignedPerson || "";

        document.getElementById("comments").value =
            item.comments || "";


        document.getElementById("currentArea").value =
            item.currentArea || "";


        this.populateZones(

            item.currentArea,

            item.currentZone

        );

    },
    // ==================================================
    // LOAD MOVEMENT HISTORY
    // ==================================================

    async loadMovementHistory() {

        try {

            const response = await fetch(
                FLOWS.GET_MOVEMENT_HISTORY_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        taskId: taskId
                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    await response.text()
                );

            }

            const result = await response.json();

            // Supports either:
            // [ ... ]
            // OR
            // { history : [ ... ] }

            let history = [];

            if (Array.isArray(result)) {

                history = result;

            }
            else if (Array.isArray(result.history)) {

                history = result.history;

            }

            this.renderMovementHistory(history);

        }

        catch (err) {

            console.error(err);

            document.getElementById("movementHistory").innerHTML =

                `<p class="text-muted">
                    No movement history available.
                </p>`;

        }

    },



    // ==================================================
    // RENDER MOVEMENT HISTORY
    // ==================================================

    renderMovementHistory(history) {

        const container =
            document.getElementById("movementHistory");

        container.innerHTML = "";


        if (!history || history.length === 0) {

            container.innerHTML =

                `<p class="text-muted">
                    No movement history available.
                </p>`;

            return;

        }


        history.forEach(move => {

            container.innerHTML += `

<div class="history-card">

    <div class="history-header">

        <span class="history-date">

            ${this.formatDate(move.MovementTime)}

        </span>

    </div>


    <div class="history-body">

        <div class="history-row">

            <strong>Area</strong>

            <span>

                ${move.PreviousArea || "-"}

                →

                ${move.NewArea || "-"}

            </span>

        </div>


        <div class="history-row">

            <strong>Zone</strong>

            <span>

                ${move.PreviousZone || "-"}

                →

                ${move.NewZone || "-"}

            </span>

        </div>


        <div class="history-row">

            <strong>Status</strong>

            <span>

                ${move.MovementStatus || "-"}

            </span>

        </div>


        <div class="history-row">

            <strong>Updated By</strong>

            <span>

                ${move.UpdatedBy || "-"}

            </span>

        </div>


        <div class="history-row">

            <strong>Movement Type</strong>

            <span>

                ${move.MovementType || "-"}

            </span>

        </div>


        ${move.Notes ?

            `<div class="history-row">

                <strong>Notes</strong>

                <span>${move.Notes}</span>

            </div>`

            :

            ""

        }

    </div>

</div>

`;

        });

    },



    // ==================================================
    // FORMAT DATE
    // ==================================================

    formatDate(date) {

    if (!date) {
        return "-";
    }

    try {

        return new Date(date).toLocaleString("en-IN", {

            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true

        });

    }

    catch {

        return date;

    }

},
    // ==================================================
    // UPDATE COMPONENT
    // ==================================================

    async updateComponent() {

        try {

            // -------------------------------
            // Basic Validation
            // -------------------------------

            const status =
                document.getElementById("status").value;

            const currentArea =
                document.getElementById("currentArea").value;

            const currentZone =
                document.getElementById("currentZone").value;

            const comments =
                document.getElementById("comments").value.trim();

            if (!status) {

                alert("Please select a Status.");

                return;

            }

            if (!currentArea) {

                alert("Please select the Current Area.");

                return;

            }

            if (!currentZone) {

                alert("Please select the Current Zone.");

                return;

            }


            // -------------------------------
            // Disable Button
            // -------------------------------

            const btn =
                document.getElementById("updateBtn");

            const originalText = btn.innerHTML;

            btn.disabled = true;

            btn.innerHTML = "Updating...";


            // -------------------------------
            // Prepare Payload
            // -------------------------------

            const payload = {

                taskId: taskId,

                status: status,

                currentArea: currentArea,

                currentZone: currentZone,

                comments: comments

            };

            // -------------------------------
            // Call Power Automate
            // -------------------------------

            const response = await fetch(

                FLOWS.UPDATE_COMPONENT,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(payload)

                }

            );


            if (!response.ok) {

                throw new Error(

                    await response.text()

                );

            }


            const result =
                await response.json();

            console.log(result);


            // -------------------------------
            // Success
            // -------------------------------

            if (result.success === false) {

                throw new Error(

                    result.message ||

                    "Update failed."

                );

            }


            alert("✅ Component updated successfully!");


            // -------------------------------
            // Reload Everything
            // -------------------------------

            await this.loadComponent();

            await this.loadMovementHistory();


            // -------------------------------
            // Restore Button
            // -------------------------------

            btn.disabled = false;

            btn.innerHTML = originalText;

        }

        catch (err) {

            console.error(err);

            alert(

                "Update Failed\n\n"

                + err.message

            );


            // Restore Button even if failed

            const btn =
                document.getElementById("updateBtn");

            btn.disabled = false;

            btn.innerHTML = "Update Component";

        }

    },
    // ==================================================
    // RESET FORM (Optional Helper)
    // ==================================================

    resetComments() {

        const comments =
            document.getElementById("comments");

        if (comments) {

            comments.value = "";

        }

    },



    // ==================================================
    // DEBUG COMPONENT
    // ==================================================

    debug() {

    if(!CONFIG.DEBUG) return;

    console.group("TrackLab Debug");

    console.log("Task ID :", taskId);

    console.log(this.component);

    console.groupEnd();

}

};



// ======================================================
// INITIALIZE PAGE
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await ComponentPage.init();

    }

    catch (err) {

        console.error(err);

        alert(
            "Unable to initialize page.\n\n"
            + err.message
        );

    }

});