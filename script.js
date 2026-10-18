const orderForm = document.querySelector(".order-form");
const successMessage = document.querySelector("#success-message");
const orderButton = document.querySelector(".order-button");

orderForm.addEventListener("submit", async function(event) {

  event.preventDefault();

  orderButton.textContent = "SENDING...";
  orderButton.disabled = true;

  const formData = new FormData(orderForm);

  try {

    const response = await fetch(orderForm.action, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json"
      }
    });

    if (response.ok) {

      orderForm.reset();

      orderForm.style.display = "none";

      successMessage.style.display = "block";

    } else {

      alert("Something went wrong. Please try again.");

      orderButton.textContent = "SEND ORDER REQUEST";
      orderButton.disabled = false;

    }

  } catch (error) {

    alert("Unable to send your order. Please try again.");

    orderButton.textContent = "SEND ORDER REQUEST";
    orderButton.disabled = false;

  }

});
