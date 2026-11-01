const form = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");
const products = document.querySelectorAll(".order-product");
const estimatedTotalDisplay = document.getElementById("estimated-total");
const orderSummaryInput = document.getElementById("order-summary");
const orderTotalInput = document.getElementById("order-total");

/* =========================
   UPDATE ORDER + TOTAL
========================= */

function updateOrder() {
  let regularTotal = 0;
  let dealQuantity = 0;
  let cookieQuantity = 0;
  const selectedItems = [];

  products.forEach(function (product) {
    const name = product.dataset.name;
    const price = Number(product.dataset.price);
    const category = product.dataset.category;

    const quantityElement =
      product.querySelector(".quantity-value");

    const quantity =
      Number(quantityElement.textContent);

    if (quantity > 0) {
      selectedItems.push(quantity + " x " + name);

      // COOKIE DEAL
      // $3.50 each or 4 for $12
      if (category === "cookie") {
        cookieQuantity += quantity;
      }

      // MUFFIN / BROWNIE / BROOKIE DEAL
      // $7 each or any 2 for $12
      else if (
        category === "muffin" ||
        category === "brownie" ||
        category === "brookie"
      ) {
        dealQuantity += quantity;
      }

      // EVERYTHING ELSE
      else {
        regularTotal += price * quantity;
      }
    }
  });

  /* 2 FOR $12 DEAL */

  const dealPairs =
    Math.floor(dealQuantity / 2);

  const remainingDealItems =
    dealQuantity % 2;

  const dealTotal =
    (dealPairs * 12) +
    (remainingDealItems * 7);


  /* COOKIE 4 FOR $12 DEAL */

  const cookieGroups =
    Math.floor(cookieQuantity / 4);

  const remainingCookies =
    cookieQuantity % 4;

  const cookieTotal =
    (cookieGroups * 12) +
    (remainingCookies * 3.50);


  /* FINAL TOTAL */

  const finalTotal =
    regularTotal +
    dealTotal +
    cookieTotal;

  estimatedTotalDisplay.textContent =
    "$" + finalTotal.toFixed(2);


  /* ORDER SUMMARY */

  if (selectedItems.length > 0) {
    orderSummaryInput.value =
      selectedItems.join("\n");
  } else {
    orderSummaryInput.value =
      "No items selected";
  }

  orderTotalInput.value =
    "$" + finalTotal.toFixed(2);
}


/* =========================
   PLUS / MINUS BUTTONS
========================= */

products.forEach(function (product) {
  const minusButton =
    product.querySelector(".minus");

  const plusButton =
    product.querySelector(".plus");

  const quantityElement =
    product.querySelector(".quantity-value");


  if (plusButton) {
    plusButton.addEventListener(
      "click",
      function () {
        let quantity =
          Number(quantityElement.textContent);

        quantity++;

        quantityElement.textContent =
          quantity;

        updateOrder();
      }
    );
  }


  if (minusButton) {
    minusButton.addEventListener(
      "click",
      function () {
        let quantity =
          Number(quantityElement.textContent);

        if (quantity > 0) {
          quantity--;
        }

        quantityElement.textContent =
          quantity;

        updateOrder();
      }
    );
  }
});


/* =========================
   CHECK FOR ITEMS
========================= */

function orderHasItems() {
  let hasItems = false;

  products.forEach(function (product) {
    const quantity =
      Number(
        product.querySelector(
          ".quantity-value"
        ).textContent
      );

    if (quantity > 0) {
      hasItems = true;
    }
  });

  return hasItems;
}


/* =========================
   RESET ORDER BUILDER
========================= */

function resetOrderBuilder() {
  products.forEach(function (product) {
    const quantityElement =
      product.querySelector(
        ".quantity-value"
      );

    quantityElement.textContent = "0";
  });

  updateOrder();
}


/* =========================
   FORM SUBMISSION
========================= */

if (form) {
  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      /* REQUIRE AT LEAST ONE ITEM */

      if (!orderHasItems()) {
        formStatus.textContent =
          "Please choose at least one baked good before sending your order.";

        return;
      }


      updateOrder();


      const submitButton =
        form.querySelector(
          ".order-button"
        );


      submitButton.disabled = true;

      submitButton.textContent =
        "SENDING...";

      formStatus.textContent =
        "Sending your order request...";


      const formData =
        new FormData(form);


      try {

        const response =
          await fetch(
            form.action,
            {
              method: form.method,
              body: formData,
              headers: {
                Accept:
                  "application/json"
              }
            }
          );


        /* SUCCESS */

        if (response.ok) {

          const confirmation =
            document.getElementById(
              "order-confirmation"
            );

          formStatus.textContent = "";


          if (confirmation) {
            confirmation.classList.add(
              "show"
            );
          }


          form.reset();

          resetOrderBuilder();


          if (confirmation) {
            confirmation.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }

        }


        /* FORMSPREE ERROR */

        else {

          formStatus.textContent =
            "Something went wrong while sending your order. Please try again.";

        }

      }


      /* CONNECTION ERROR */

      catch (error) {

        formStatus.textContent =
          "Unable to send your order request right now. Please try again.";

      }


      submitButton.disabled = false;

      submitButton.textContent =
        "SEND ORDER REQUEST";

    }
  );
}

/* =========================
   CATERING FORM SUBMISSION
========================= */

const cateringForm =
  document.querySelector(".catering-form");

if (cateringForm) {

  cateringForm.addEventListener(
    "submit",
    async function (event) {

      // Stops Formspree from taking the customer
      // away from Pam's website
      event.preventDefault();

      const submitButton =
        cateringForm.querySelector(
          ".catering-submit"
        );

      const confirmation =
        document.getElementById(
          "catering-confirmation"
        );

      submitButton.disabled = true;
      submitButton.textContent = "SENDING...";

      const formData =
        new FormData(cateringForm);

      try {

        const response =
          await fetch(
            cateringForm.action,
            {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json"
              }
            }
          );

        if (response.ok) {

          cateringForm.reset();

          if (confirmation) {

            confirmation.classList.add("show");

            confirmation.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }

        } else {

          alert(
            "Something went wrong while sending your catering inquiry. Please try again."
          );

        }

      } catch (error) {

        alert(
          "Unable to send your catering inquiry right now. Please try again."
        );

      }

      submitButton.disabled = false;

      submitButton.textContent =
        "SEND CATERING INQUIRY";

    }
  );

}

/* =========================
   INITIAL TOTAL
========================= */

updateOrder();
