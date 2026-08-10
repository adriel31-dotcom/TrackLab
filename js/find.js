const input = document.getElementById("taskIdInput");
const button = document.getElementById("findBtn");

function searchComponent() {

    const taskId = input.value.trim();

    if (!taskId) {

        alert("Please enter a Task ID.");
        return;

    }

    window.location.href =
        `component.html?taskId=${encodeURIComponent(taskId)}`;

}

button.addEventListener("click", searchComponent);

input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        searchComponent();

    }

});