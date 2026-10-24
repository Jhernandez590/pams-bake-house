const form = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");

const products = document.querySelectorAll(".order-product");

const estimatedTotalDisplay =
  document.getElementById("estimated-total");

const orderSummaryInput =
  document.getElementById("order-summary");

const orderTotalInput =
  document.getElementById("order-total");


/* =========================
   UPDATE ORDER
========================= */

function updateOrder() {

  let regularTotal = 0;
  let muffinQuantity = 0;

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

      selectedItems.push(
        quantity + " x " + name
      );


      if (category === "muffin") {

        muffinQuantity += quantity;

      } else {

        regularTotal += price * quantity;

      }

    }

  });


  /* =========================
     MUFFIN DEAL
     $7 EACH
     2 FOR $12
  ========================= */

  const muffinPairs =
    Math.floor(muffinQuantity / 2);

  const remainingMuffins =
    muffinQuantity % 2;

  const muffinTotal =
    (muffinPairs * 12) +
    (remainingMuffins * 7);


  /* =========================
     FINAL TOTAL
  ========================= */

  const finalTotal =
    regularTotal + muffinTotal;


  estimatedTotalDisplay.textContent =
    "$" + finalTotal.toFixed(2);


  /* =========================
     DATA SENT TO FORMSPREE
  ========================= */

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
   QUANTITY BUTTONS
========================= */

products.forEach(function (product) {

  const minusButton =
    product.querySelector(".minus");

  const plusButton =
    product.querySelector(".plus");

  const quantityElement =
    product.querySelector(".quantity-value");


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


  minusButton.addEventListener(
    "click",
    function () {

      let quantity =
        Number(quantityElement.textContent);


      if (quantity > 0) {

        quantity--;

        quantityElement.textContent =
          quantity;

        updateOrder();

      }

    }
  );

});


/* =========================
   CHECK IF ORDER HAS ITEMS
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
      product.querySelector(".quantity-value");

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


      /* CUSTOMER MUST CHOOSE
         AT LEAST ONE ITEM */

      if (!orderHasItems()) {

        formStatus.textContent =
          "Please choose at least one baked good before sending your order.";

        return;

      }


      updateOrder();


      const submitButton =
        form.querySelector(".order-button");


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
                Accept: "application/json"
              }
            }
          );


        if (response.ok) {

          formStatus.textContent =
            "Thank you! Your order request has been sent. Pam's Bake House will follow up to confirm your order.";

          form.reset();

          resetOrderBuilder();


        } else {

          formStatus.textContent =
            "Something went wrong while sending your order. Please try again.";

        }


      } catch (error) {

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
   INITIALIZE
========================= */

updateOrder();
