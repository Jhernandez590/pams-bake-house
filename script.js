const form = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");

if (form) {

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const submitButton = form.querySelector(".order-button");

    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    formStatus.textContent = "";

    const formData = new FormData(form);

    try {

      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {

        formStatus.textContent =
          "Thank you! Your order request has been sent.";

        form.reset();

      } else {

        formStatus.textContent =
          "Something went wrong. Please try again.";

      }

    } catch (error) {

      formStatus.textContent =
        "Unable to send your request. Please try again.";

    }

    submitButton.disabled = false;
    submitButton.textContent = "SEND ORDER REQUEST";

  });

}
