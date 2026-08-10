document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("registerBtn")
        .addEventListener("click", () => {

            window.location.href = "register.html";

        });

    document.getElementById("updateBtn")
        .addEventListener("click", () => {

            window.location.href = "find.html";

        });

    document.getElementById("dashboardBtn")
        .addEventListener("click", () => {

            window.location.href = "dashboard.html";

        });

});