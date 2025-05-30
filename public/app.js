document.addEventListener("DOMContentLoaded", () => {
  const testButton = document.getElementById("testButton");
  const screenTimeTodayDiv = document.getElementById("screenTimeToday");
  const webhookButton = document.getElementById("webhookButton");
  const createWebhookTriggerDiv = document.getElementById(
    "createWebhookTrigger"
  );
  const testWebhookButton = document.getElementById("testWebhookButton");
  const testWebhookTriggerDiv = document.getElementById("testWebhookTrigger");

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

      testWebhookTriggerDiv.textContent = "Webhook trigger tested!";
      testWebhookTriggerDiv.className = "success";
    } catch (error) {
      alert("Error testing webhook trigger");
      console.error("Error:", error);
    }
  });
});
