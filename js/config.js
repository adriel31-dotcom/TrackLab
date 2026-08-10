const LAB_ZONES = {
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

const STATUS = [
    "Received",
    "Incoming Inspection",
    "Testing",
    "Storage",
    "Completed",
    "Collected"
];

const FLOWS = {
    REGISTER: "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/85f295a4c62841e9a11652eacbf1ac91/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_O3uV2eSdn5Jrf-Sy4ToHK9mPxEF5CpzWEmQZAtL_Ww",
    GET_COMPONENT: "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a78a38cdb00c4bcbb30d0e4cfd3e6df5/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lZRLFILr3xbhThs51CQd2MMBtvKUxSk3U-2zjhcecZs",
    UPDATE_COMPONENT: "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/d49b3f6ca46a4c57926ea95fbd599b43/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TJPfFQXkGsHn1m48xLPTRggaTnXXks5VK3fW37m51m0",
    DASHBOARD: "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ae86d82fdeba41bfbeaace2e49a9dc76/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tDV3VwuFUkJCR6oz03XiWrISGMt7SMuSLgyBJ8AO5yM",
    GET_MOVEMENT_HISTORY_API: "https://default097464b8069c453e9254c17ec70731.0d.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/19/workflows/7d0178adb449431ab2a2ac7c5facaf3d/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jiBp4TOm4DrBVeC46LSFCVpd4mw1ClGwKv_VyMGVUqQ"
};

const CONFIG = {

    DEBUG:false,

    APP_URL:""

};

const ROUTES = {

    HOME: "index.html",

    REGISTER: "register.html",

    DASHBOARD: "dashboard.html",

    COMPONENT: "component.html",

    FIND: "find.html",

    SUCCESS: "success.html",

    QR: "qr.html"

};