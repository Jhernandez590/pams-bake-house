/* =========================
   REGULAR ORDER FORM
========================= */

const form = document.getElementById("order-form");
const formStatus = document.getElementById("form-status");

const products =
  document.querySelectorAll(".order-product");

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
  let dealQuantity = 0;

  const selectedItems = [];


  products.forEach(function (product) {

    const name =
      product.dataset.name;

    const price =
      Number(product.dataset.price);

    const category =
      product.dataset.category;

    const quantityElement =
      product.querySelector(".quantity-value");

    const quantity =
      Number(quantityElement.textContent);


    if (quantity > 0) {

      selectedItems.push(
        quantity + " x " + name
      );


      /*
        MUFFINS + BROWNIES + BROOKIES

        $7 each
        Any 2 for $12
      */

      if (
        category === "muffin" ||
        category === "brownie" ||
        category === "brookie"
      ) {

        dealQuantity += quantity;

      } else {

        regularTotal +=
          price * quantity;

      }

    }

  });


  /* MIX & MATCH DEAL */

  const dealPairs =
    Math.floor(dealQuantity / 2);

  const remainingDealItems =
    dealQuantity % 2;

  const dealTotal =
    (dealPairs * 12) +
    (remainingDealItems * 7);


  /* FINAL TOTAL */

  const finalTotal =
    regularTotal + dealTotal;


  if (estimatedTotalDisplay) {

    estimatedTotalDisplay.textContent =
      "$" + finalTotal.toFixed(2);

  }


  /* ORDER SUMMARY */

  if (orderSummaryInput) {

    if (selectedItems.length > 0) {

      orderSummaryInput.value =
        selectedItems.join("\n");

    } else {

      orderSummaryInput.value =
        "No items selected";

    }

  }


  if (orderTotalInput) {

    orderTotalInput.value =
      "$" + finalTotal.toFixed(2);

  }

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


  if (
    !minusButton ||
    !plusButton ||
    !quantityElement
  ) {
    return;
  }


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
   CHECK ORDER ITEMS
========================= */

function orderHasItems() {

  let hasItems = false;


  products.forEach(function (product) {

    const quantityElement =
      product.querySelector(".quantity-value");


    if (!quantityElement) {
      return;
    }


    const quantity =
      Number(quantityElement.textContent);


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


    if (quantityElement) {

      quantityElement.textContent =
        "0";

    }

  });


  updateOrder();

}


/* =========================
   REGULAR ORDER SUBMISSION
========================= */

if (form) {

  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (!orderHasItems()) {

        if (formStatus) {

          formStatus.textContent =
            "Please choose at least one baked good before sending your order.";

        }

        return;

      }


      updateOrder();


      const submitButton =
        form.querySelector(".order-button");

      const confirmation =
        document.getElementById(
          "order-confirmation"
        );


      if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
          "SENDING...";

      }


      if (formStatus) {

        formStatus.textContent =
          "Sending your order request...";

      }


      const formData =
        new FormData(form);


      try {

        const response =
          await fetch(
            form.action,
            {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json"
              }
            }
          );


        if (response.ok) {

          if (formStatus) {
            formStatus.textContent = "";
          }


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


        } else {

          if (formStatus) {

            formStatus.textContent =
              "Something went wrong while sending your order. Please try again.";

          }

        }


      } catch (error) {

        if (formStatus) {

          formStatus.textContent =
            "Unable to send your order request right now. Please try again.";

        }

      }


      if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
          "SEND ORDER REQUEST";

      }

    }
  );

}


/* =========================
   CATERING FORM
========================= */

const cateringForm =
  document.querySelector(".catering-form");

const cateringConfirmation =
  document.getElementById(
    "catering-confirmation"
  );


if (cateringForm) {

  cateringForm.addEventListener(
    "submit",
    async function (event) {

      /*
        STOP BROWSER FROM GOING
        TO FORMSPREE'S WEBSITE
      */

      event.preventDefault();


      const cateringSubmitButton =
        cateringForm.querySelector(
          ".catering-submit"
        );


      if (cateringSubmitButton) {

        cateringSubmitButton.disabled =
          true;

        cateringSubmitButton.textContent =
          "SENDING...";

      }


      const cateringFormData =
        new FormData(cateringForm);


      try {

        const response =
          await fetch(
            cateringForm.action,
            {
              method: "POST",
              body: cateringFormData,
              headers: {
                Accept: "application/json"
              }
            }
          );


        if (response.ok) {

          cateringForm.reset();


          if (cateringConfirmation) {

            cateringConfirmation.classList.add(
              "show"
            );


            cateringConfirmation.scrollIntoView({
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


      if (cateringSubmitButton) {

        cateringSubmitButton.disabled =
          false;

        cateringSubmitButton.textContent =
          "SEND CATERING INQUIRY";

      }

    }
  );

}


/* =========================
   INITIALIZE
========================= */

updateOrder();
