const params = new URLSearchParams(window.location.search);

const taskId = params.get("taskId");
const trackLabUID = params.get("trackLabUID");
const trNumber = params.get("trNumber");

document.getElementById("taskId").textContent =
    taskId || "-";

if (!taskId || !trackLabUID) {
    window.location.href = "register.html";
}

// View Component
document.getElementById("viewComponent").href =
    `component.html?uid=${encodeURIComponent(trackLabUID)}`;

// Print QR
document.getElementById("printQR").href =
    `qr.html?type=component&id=${encodeURIComponent(trackLabUID)}`;