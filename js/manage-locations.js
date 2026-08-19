// ============================================================
// TrackLab - Manage Locations
// ============================================================

// Get Locations API
const GET_LOCATIONS_API = "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/29/workflows/296371772807487b8b1ec608c591b4bb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0q_xp7BTCCTBdr4_CXOwEUc9iu-ZXrzfd1zddNpG_bo";
// Update Location API
const CREATE_LOCATION_API = "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/09/workflows/593c8326a2654509824351f4b51ac47e/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7mqckEkz7hJpmcu59OHOHjM-PO5cqr1NRihNCXYaHdY";
const locationsTableBody = document.querySelector("#locationsBody");
const locationSearch = document.querySelector("#search");
const refreshBtn = document.querySelector("#refreshBtn");
const addLocationBtn = document.querySelector("#addBtn");

// Store locations received from API
let locations = [];


// ============================================================
// LOAD LOCATIONS
// ============================================================

async function loadLocations() {

    if (!locationsTableBody) {
        console.error("locationsTableBody not found.");
        return;
    }

    locationsTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="loading">
                Loading locations...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(GET_LOCATIONS_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        console.log("Locations API response:", data);

        locations = Array.isArray(data) ? data : [];

        renderLocations(locations);

    } catch (error) {

        console.error("Failed to load locations:", error);

        locationsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="error">
                    Failed to load locations.
                </td>
            </tr>
        `;
    }
}


// ============================================================
// RENDER LOCATIONS
// ============================================================

function renderLocations(list = locations) {
    if (!locationsTableBody) {
        console.error("locationsTableBody not found.");
        return;
    }

    locationsTableBody.innerHTML = "";

    if (!list || list.length === 0) {
        locationsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:20px;">
                    No locations found.
                </td>
            </tr>
        `;
        return;
    }

    list.forEach((location, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${location.code || "-"}</td>

            <td>${location.area || "-"}</td>

            <td>${location.zone || "-"}</td>

            <td>
                <span class="${location.active ? "status-active" : "status-inactive"}">
                    ${location.active ? "Active" : "Inactive"}
                </span>
            </td>

            <td>
                <button 
                    class="edit-btn"
                    onclick="editLocation(${index})">
                    Edit
                </button>
            </td>
        `;

        locationsTableBody.appendChild(row);
    });
}


// ============================================================
// SEARCH
// ============================================================

function searchLocations() {

    const searchText = locationSearch.value
        .trim()
        .toLowerCase();

    if (!searchText) {
        renderLocations(locations);
        return;
    }

    const filtered = locations.filter(location => {

        const code =
            String(location.Code ?? "").toLowerCase();

        const area =
            String(
                location.AreaLabValue ??
                location.AreaLab ??
                ""
            ).toLowerCase();

        const zone =
            String(location.ZoneStation ?? "").toLowerCase();

        return (
            code.includes(searchText) ||
            area.includes(searchText) ||
            zone.includes(searchText)
        );

    });

    renderLocations(filtered);
}


// ============================================================
// EDIT LOCATION
// ============================================================

function editLocation(index) {
    const location = locations[index];

    if (!location) {
        console.error("Location not found:", index);
        return;
    }

    console.log("Edit location:", location);

    const modal = document.createElement("div");

    modal.id = "editLocationModal";

    modal.innerHTML = `
        <div class="edit-modal-overlay">
            <div class="edit-modal">

                <div class="edit-modal-header">
                    <h2>Edit Location</h2>
                    <button type="button" id="closeEditModal">&times;</button>
                </div>

                <div class="edit-modal-body">

                    <label>Location Code</label>
                    <input
                        type="text"
                        id="editLocationCode"
                        value="${location.code || ""}"
                        readonly
                    >

                    <label>Area / Lab</label>
                    <input
                        type="text"
                        id="editLocationArea"
                        value="${location.area || ""}"
                    >

                    <label>Zone / Station</label>
                    <input
                        type="text"
                        id="editLocationZone"
                        value="${location.zone || ""}"
                    >

                    <label class="edit-checkbox">
                        <input
                            type="checkbox"
                            id="editLocationActive"
                            ${location.active ? "checked" : ""}
                        >
                        Active
                    </label>

                </div>

                <div class="edit-modal-footer">
                    <button type="button" id="cancelEditLocation">
                        Cancel
                    </button>

                    <button type="button" id="saveEditLocation">
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeEditModal").onclick = () => {
        modal.remove();
    };

    document.getElementById("cancelEditLocation").onclick = () => {
        modal.remove();
    };

    document.getElementById("saveEditLocation").onclick = async () => {

    const updatedLocation = {
        action: "update",
        code: document.getElementById("editLocationCode").value.trim(),
        area: document.getElementById("editLocationArea").value.trim(),
        zone: document.getElementById("editLocationZone").value.trim(),
        active: document.getElementById("editLocationActive").checked,
        remarks: "Updated from TrackLab Manage Locations"
    };

    console.log("Updating location:", updatedLocation);

    // Basic validation
    if (!updatedLocation.code || !updatedLocation.area || !updatedLocation.zone) {
        alert("Please fill in Area / Lab and Zone / Station.");
        return;
    }

    try {

        const response = await fetch(
            "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/14/workflows/f81e7b2906f34e649573f46f334fe948/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cv2SUd0UgXihMpsF-t-U9kqVnsK4OB1N_4YDIbB67rs",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedLocation)
            }
        );

        const data = await response.json();

        console.log("Update API response:", data);

            if (!response.ok) {
             throw new Error("Location update failed.");
            }

        alert("Location updated successfully.");

        modal.remove();

        await loadLocations();

    } catch (error) {

        console.error("Update location error:", error);

        alert(
            "Failed to update location.\n\n" +
            (error.message || "Unknown error")
        );
    }
};
}

// ============================================================
// ADD LOCATION
// ============================================================

function addLocation() {

    const modal = document.createElement("div");

    modal.id = "addLocationModal";

    modal.innerHTML = `
        <div class="edit-modal-overlay">
            <div class="edit-modal">

                <div class="edit-modal-header">
                    <h2>Add Location</h2>

                    <button type="button" id="closeAddModal">
                        &times;
                    </button>
                </div>

                <div class="edit-modal-body">

                    <label>Location Code</label>
                    <input
                        type="text"
                        id="addLocationCode"
                        placeholder="Example: MAT-010"
                    >

                    <label>Area / Lab</label>
                    <input
                        type="text"
                        id="addLocationArea"
                        placeholder="Example: Materials Lab"
                    >

                    <label>Zone / Station</label>
                    <input
                        type="text"
                        id="addLocationZone"
                        placeholder="Example: Test Bench"
                    >

                    <label class="edit-checkbox">
                        <input
                            type="checkbox"
                            id="addLocationActive"
                            checked
                        >
                        Active
                    </label>

                </div>

                <div class="edit-modal-footer">

                    <button
                        type="button"
                        id="cancelAddLocation"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="saveAddLocation"
                    >
                        Add Location
                    </button>

                </div>

            </div>
        </div>
    `;

    document.body.appendChild(modal);


    // --------------------------------------------------------
    // CLOSE MODAL
    // --------------------------------------------------------

    document.getElementById("closeAddModal").onclick = () => {
        modal.remove();
    };


    // --------------------------------------------------------
    // CANCEL
    // --------------------------------------------------------

    document.getElementById("cancelAddLocation").onclick = () => {
        modal.remove();
    };


    // --------------------------------------------------------
    // ADD LOCATION
    // --------------------------------------------------------

    document.getElementById("saveAddLocation").onclick = async () => {

    const newLocation = {
        action: "create",

        code: document
            .getElementById("addLocationCode")
            .value
            .trim(),

        area: document
            .getElementById("addLocationArea")
            .value
            .trim(),

        zone: document
            .getElementById("addLocationZone")
            .value
            .trim(),

        active: document
            .getElementById("addLocationActive")
            .checked,

        remarks: "Created from TrackLab Manage Locations"
    };

    console.log("Creating location:", newLocation);


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
        !newLocation.code ||
        !newLocation.area ||
        !newLocation.zone
    ) {
        alert(
            "Please fill in Location Code, Area / Lab and Zone / Station."
        );

        return;
    }


    // --------------------------------------------------------
    // CREATE LOCATION API
    // --------------------------------------------------------

    try {

        const response = await fetch(
            CREATE_LOCATION_API,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(newLocation)
            }
        );


        const data = await response.json();

        console.log("Create API response:", data);


        if (!response.ok || data.success !== true) {
            throw new Error(
                data.message || "Location creation failed."
            );
        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        alert("Location created successfully.");

        modal.remove();

        // Reload the locations table
        await loadLocations();


    } catch (error) {

        console.error(
            "Create location error:",
            error
        );

        alert(
            "Failed to create location.\n\n" +
            (error.message || "Unknown error")
        );
    }
};
}
// ============================================================
// EVENT LISTENERS
// ============================================================

if (refreshBtn) {

    refreshBtn.addEventListener("click", () => {
        loadLocations();
    });

}

if (locationSearch) {

    locationSearch.addEventListener("input", () => {
        searchLocations();
    });

}

if (addLocationBtn) {

    addLocationBtn.addEventListener("click", () => {
        addLocation();
    });

}


// ============================================================
// INITIAL LOAD
// ============================================================

loadLocations();