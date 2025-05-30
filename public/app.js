document.addEventListener("DOMContentLoaded", () => {
  const testButton = document.getElementById("testButton");
  const messageDiv = document.getElementById("message");
  const webhookButton = document.getElementById("webhookButton");
  const loadTriggersButton = document.getElementById("loadTriggersButton");
  const webhookTriggersDiv = document.getElementById("webhookTriggers");
  const testWebhookButton = document.getElementById("testWebhookButton");
  const triggerId = document.getElementById("triggerId");

  testButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/screenTimeToday");
      const data = await response.json();

      messageDiv.textContent = JSON.stringify(data, null, 2);
      messageDiv.className = "success";
    } catch (error) {
      messageDiv.textContent = "Error connecting to server";
      messageDiv.className = "error";
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

      alert("Webhook trigger created");
    } catch (error) {
      alert("Error creating webhook");
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

      const response = await fetch("/api/testWebhookTrigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ triggerId: id }),
      });

      alert("Webhook trigger tested!");
    } catch (error) {
      alert("Error testing webhook trigger");
      console.error("Error:", error);
    }
  });
});
