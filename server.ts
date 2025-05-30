import express, { Request, Response } from "express";
import path from "path";
import crypto from "crypto";
import localtunnel from "localtunnel";

import { WebhookTriggers } from "./triggers";
import { displayASCIIArt } from "./displayASCIIArt";

// --- Constants --- //
// TODO: Insert your API key and webhook secret here
const API_URL = "https://api.thescreentimenetwork.com/external/v1"; // The Screen Time Network API URL
const API_KEY = "your_api_key";
const WEBHOOK_SECRET = "your_webhook_secret";
const YOUR_HANDLE = "your_screen_time_network_handle"; // Your Screen Time Network handle

// ---- Utils ---- //
const makeAPIRequest = async (
  path: string,
  method: "GET" | "POST",
  body?: string
) => {
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

const validateWebhookBody = (
  rawBody: string,
  receivedSig: string
): any | null => {
  const expectedSig = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const sigValid = crypto.timingSafeEqual(
    Buffer.from(receivedSig),
    Buffer.from(expectedSig)
  );

  if (!sigValid) {
    return null;
  }

  return JSON.parse(rawBody);
};

// ---- Express server ---- //
const app = express();
const port: number = 8000;

// ---- Webhook ---- //
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }), // NOTE: make sure to use raw body parser for webhook
  async (req: Request, res: Response) => {
    const rawBody = req.body.toString("utf8");
    const receivedSig = req.headers["x-clearspace-signature"] as string;

    const body = validateWebhookBody(rawBody, receivedSig);

    if (!body) {
      return res.status(401).send("Invalid signature");
    } else if (!body.handle || !body.trigger) {
      return res.status(400).send("Invalid webhook body");
    }

    const { handle, trigger } = body;


    console.log("\n\n")
    displayASCIIArt(`Webhook Received!`);
    console.log("\nWebhook Payload:", { handle, trigger });
    console.log("\n\n\n\n\n\n")

    res.status(200).send();
  }
);

// ---- Server Routes ---- //

app.use(express.static("public"));

app.use(express.json());

app.get("/api/screenTimeToday", async (_req: Request, res: Response) => {
  const screenTimeTodayData = await makeAPIRequest(
    `/screenTimeToday?handle=${YOUR_HANDLE}`,
    "GET"
  );
  if (!screenTimeTodayData.success) {
    return res.status(400).send(screenTimeTodayData.error);
  } else {
    return res.json(screenTimeTodayData.data);
  }
});

let localTunnelUrl: string | null = null;
let webhookTriggerId: string | null = null; // NOTE: Storing this here for testing purposes, you should store these ids yourself to test them
app.post("/api/createWebhookTrigger", async (req: Request, res: Response) => {
  if (!localTunnelUrl) {
    return res.status(500).send("Local tunnel URL not found");
  }

  const createWebhookTriggerData = await makeAPIRequest(
    `/createWebhookTrigger`,
    "POST",
    JSON.stringify({
      handle: YOUR_HANDLE,
      webhookURL: `${localTunnelUrl}/api/webhook`,
      trigger: WebhookTriggers.TEST,
    })
  );
  webhookTriggerId = createWebhookTriggerData.data?.id;

  if (!createWebhookTriggerData.success) {
    return res.status(400).send(createWebhookTriggerData.error);
  } else {
    return res.json(createWebhookTriggerData.data);
  }
});

app.post("/api/testWebhookTrigger", async (req: Request, res: Response) => {
  if (!webhookTriggerId) {
    return res.status(400).send("Webhook trigger ID not found");
  }

  await makeAPIRequest(
    `/testWebhookTrigger`,
    "POST",
    JSON.stringify({ id: webhookTriggerId })
  );
  res.status(200).send();
});

// Serve the main HTML file for all other routes
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// ---- Local Tunnel ---- //
(async () => {
  try {
    const tunnel = await localtunnel({ port: port });

    console.log("Local Tunnel URL", tunnel.url);
    localTunnelUrl = tunnel.url;

    tunnel.on("close", () => {
      console.log("Local tunnel closed");
    });
  } catch (error) {
    console.error("Error creating local tunnel", error);
  }
})();
