const params = new URLSearchParams(window.location.search);

const taskId = params.get("taskId");

document.getElementById("taskId").textContent =
    taskId || "-";

if (!taskId) {
    window.location.href = "register.html";
}

document.getElementById("viewComponent").href =
`component.html?taskId=${encodeURIComponent(taskId)}`;

document.getElementById("printQR").href =
`qr.html?taskId=${encodeURIComponent(taskId)}`;