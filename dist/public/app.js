document.addEventListener("DOMContentLoaded", () => {
  const testButton = document.getElementById("testButton");
  const screenTimeTodayDiv = document.getElementById("screenTimeToday");
  const webhookButton = document.getElementById("webhookButton");
  const createWebhookTriggerDiv = document.getElementById(
    "createWebhookTrigger"
  );
  const loadTriggersButton = document.getElementById("loadTriggersButton");
  const webhookTriggersDiv = document.getElementById("webhookTriggers");
  const testWebhookButton = document.getElementById("testWebhookButton");
  const triggerId = document.getElementById("triggerId");

  testButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/screenTimeToday");
      const data = await response.json();

      screenTimeTodayDiv.textContent = JSON.stringify(data, null, 2);
      screenTimeTodayDiv.className = "success";
    } catch (error) {
      screenTimeTodayDiv.textContent = "Error connecting to server";
      screenTimeTodayDiv.className = "error";
      console.error("Error:", error);
    }
  });

  webhookButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/createWebhookTrigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      createWebhookTriggerDiv.textContent = JSON.stringify(data, null, 2);
      createWebhookTriggerDiv.className = "success";
    } catch (error) {
      createWebhookTriggerDiv.textContent = "Error creating webhook";
      createWebhookTriggerDiv.className = "error";
      console.error("Error:", error);
    }
  });

  loadTriggersButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/getWebhookTriggers");
      const data = await response.json();

      webhookTriggersDiv.textContent = JSON.stringify(data, null, 2);
      webhookTriggersDiv.className = "success";
    } catch (error) {
      webhookTriggersDiv.textContent = "Error loading webhook triggers";
      webhookTriggersDiv.className = "error";
      console.error("Error:", error);
    }
  });

  testWebhookButton.addEventListener("click", async () => {
    try {
      const id = triggerId.value.trim();
      if (!id) {
        alert("Please enter a trigger ID");
        return;
      }

      const _response = await fetch("/api/testWebhookTrigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ triggerId: id }),
      });
    } catch (error) {
      alert("Error testing webhook trigger");
      console.error("Error:", error);
    }
  });
});
