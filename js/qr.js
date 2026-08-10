const QRPage = {

    type: null,
    id: null,

    init() {

        this.loadTaskId();
        this.generateQR();
        this.attachEvents();

    },

    loadTaskId() {

        const params = new URLSearchParams(window.location.search);

            this.type = params.get("type") || "component";

            this.id = params.get("id") || params.get("taskId");

        if (!this.id) {
            window.location.href = ROUTES.REGISTER;
        return;
    }

    document.getElementById("taskId").textContent = this.id;

        const label = document.getElementById("taskLabel");

        if (this.type === "location") {
           label.textContent = "Location Code";
}       else {
           label.textContent = "Component ID";
}

},

    generateQR() {

    let qrData = "";

    if (this.type === "component") {

        qrData = CONFIG.APP_URL
            ? `${CONFIG.APP_URL}/${ROUTES.COMPONENT}?taskId=${encodeURIComponent(this.id)}`
            : `${ROUTES.COMPONENT}?taskId=${encodeURIComponent(this.id)}`;

    }

    else if (this.type === "location") {

        qrData = JSON.stringify({
            type: "location",
            locationCode: this.id
        });

    }

    new QRCode(document.getElementById("qrcode"), {

        text: qrData,

        width: 200,

        height: 200

    });

},

    attachEvents() {

        document.getElementById("printBtn").addEventListener("click", () => {

            window.print();

        });

        document.getElementById("closeBtn").addEventListener("click", () => {

            history.back();

        });

    }

};

document.addEventListener("DOMContentLoaded", () => {

    QRPage.init();

});