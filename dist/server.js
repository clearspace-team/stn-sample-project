"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const localtunnel_1 = __importDefault(require("localtunnel"));
const triggers_1 = require("./triggers");
const displayASCIIArt_1 = require("./displayASCIIArt");
// --- Constants --- //
// TODO: Insert your API key and webhook secret here
// const API_KEY = "<INSERT_API_KEY_HERE>";
// const WEBHOOK_SECRET = "<INSERT_WEBHOOK_SECRET_HERE>";
// const YOUR_HANDLE = "<INSERT_YOUR_HANDLE_HERE>"; // your Screen Time Network handle
// const API_URL = "<INSERT_API_URL_HERE>"; // your Screen Time Network API URL
const API_KEY = "39fdf8b9df31af898aabb0e7768f48793db0dc2c5b3139a665028593d41820b7";
const WEBHOOK_SECRET = "83289b34f5398f25f4922edd6114494987a772d26811e7047ff38089357c5b84";
const YOUR_HANDLE = "mike"; // your Screen Time Network handle
const API_URL = "https://clearspace-server-staging.onrender.com/external/v1";
// ---- Utils ---- //
const makeAPIRequest = async (path, method, body) => {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
        },
        body,
        method,
    });
    return response.json();
};
const validateWebhookBody = (rawBody, receivedSig) => {
    const expectedSig = crypto_1.default
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");
    const sigValid = crypto_1.default.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig));
    if (!sigValid) {
        return null;
    }
    return JSON.parse(rawBody);
};
// ---- Express server ---- //
const app = (0, express_1.default)();
const port = 8000;
// ---- Webhook ---- //
app.post("/api/webhook", express_1.default.raw({ type: "application/json" }), // NOTE: make sure to use raw body parser for webhook
async (req, res) => {
    const rawBody = req.body.toString("utf8");
    const receivedSig = req.headers["x-clearspace-signature"];
    const body = validateWebhookBody(rawBody, receivedSig);
    if (!body) {
        return res.status(401).send("Invalid signature");
    }
    else if (!body.handle || !body.trigger) {
        return res.status(400).send("Invalid webhook body");
    }
    const { handle, trigger } = body;
    console.log("Received webhook trigger!", { handle, trigger });
    (0, displayASCIIArt_1.displayASCIIArt)(`${handle} -> ${trigger}`);
    res.status(200).send();
});
// ---- Server Routes ---- //
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.get("/api/screenTimeToday", async (_req, res) => {
    const screenTimeTodayData = await makeAPIRequest(`/screenTimeToday?handle=${YOUR_HANDLE}`, "GET");
    res.json(screenTimeTodayData.data);
});
let localTunnelUrl = null;
let webhookTriggerId = null;
app.post("/api/createWebhookTrigger", async (req, res) => {
    if (!localTunnelUrl) {
        return res.status(500).send("Local tunnel URL not found");
    }
    const createWebhookTriggerData = await makeAPIRequest(`/createWebhookTrigger`, "POST", JSON.stringify({
        handle: YOUR_HANDLE,
        webhookURL: `${localTunnelUrl}/api/webhook`,
        trigger: triggers_1.WebhookTriggers.TEST,
    }));
    webhookTriggerId = createWebhookTriggerData.data?.id;
    res.json(createWebhookTriggerData.data);
});
app.get("/api/getWebhookTriggers", async (req, res) => {
    const getWebhookTriggersData = await makeAPIRequest(`/getWebhookTriggers`, "GET");
    res.json(getWebhookTriggersData.data);
});
app.post("/api/testWebhookTrigger", async (req, res) => {
    // const { triggerId } = req.body;
    if (!webhookTriggerId) {
        return res.status(400).send("Webhook trigger ID not found");
    }
    await makeAPIRequest(`/testWebhookTrigger`, "POST", JSON.stringify({ id: webhookTriggerId }));
    res.status(200).send();
});
// Serve the main HTML file for all other routes
app.get("*", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
// ---- Local Tunnel ---- //
(async () => {
    try {
        const tunnel = await (0, localtunnel_1.default)({ port: port });
        console.log("Local Tunnel URL", tunnel.url);
        localTunnelUrl = tunnel.url;
        tunnel.on("close", () => {
            console.log("Local tunnel closed");
        });
    }
    catch (error) {
        console.error("Error creating local tunnel", error);
    }
})();
