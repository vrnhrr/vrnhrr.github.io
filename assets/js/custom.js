// ===================================================
// CONTACT FORM SCRIPT
// ===================================================

// Track validation state
const formValidity = {
  name: false,
  surname: false,
  email: false,
  phone: false,
  address: false,
  rating1: false,
  rating2: false,
  rating3: false
};

// ---------------- HELPERS ----------------

function showError(field, message) {
  field.classList.add("is-invalid");

  let errorElem = field.nextElementSibling;
  if (!errorElem || !errorElem.classList.contains("error-text")) {
    errorElem = document.createElement("div");
    errorElem.classList.add("error-text");
    errorElem.style.color = "red";
    errorElem.style.fontSize = "13px";
    errorElem.style.marginTop = "4px";
    field.insertAdjacentElement("afterend", errorElem);
  }
  errorElem.textContent = message;
}

function clearError(field) {
  field.classList.remove("is-invalid");
  const errorElem = field.nextElementSibling;
  if (errorElem && errorElem.classList.contains("error-text")) {
    errorElem.remove();
  }
}

function updateSubmitButton() {
  const submitBtn = document.querySelector("#contactForm button");
  const allValid = Object.values(formValidity).every(v => v === true);
  submitBtn.disabled = !allValid;

  submitBtn.style.opacity = allValid ? "1" : "0.5";
  submitBtn.style.cursor = allValid ? "pointer" : "not-allowed";
}

// ---------------- VALIDATION ----------------

function validateName(id, key) {
  const field = document.getElementById(id);
  const value = field.value.trim();

  if (!value) {
    showError(field, "Required");
    formValidity[key] = false;
  } else if (!/^[A-Za-zÀ-ž\s-]+$/.test(value)) {
    showError(field, "Letters only");
    formValidity[key] = false;
  } else {
    clearError(field);
    formValidity[key] = true;
  }
  updateSubmitButton();
}

function validateEmail() {
  const field = document.getElementById("email-field");
  const value = field.value.trim();

  if (!value) {
    showError(field, "Required");
    formValidity.email = false;
  } else if (!/^\S+@\S+\.\S+$/.test(value)) {
    showError(field, "Invalid email");
    formValidity.email = false;
  } else {
    clearError(field);
    formValidity.email = true;
  }
  updateSubmitButton();
}

function validateAddress() {
  const field = document.getElementById("address-field");
  const value = field.value.trim();

  if (value.length < 5) {
    showError(field, "Enter a longer address");
    formValidity.address = false;
  } else {
    clearError(field);
    formValidity.address = true;
  }
  updateSubmitButton();
}

function validateRating(id, key) {
  const field = document.getElementById(id);
  const value = Number(field.value);

  if (!value || value < 1 || value > 10) {
    showError(field, "Enter 1–10");
    formValidity[key] = false;
  } else {
    clearError(field);
    formValidity[key] = true;
  }
  updateSubmitButton();
}

// ---------------- PHONE MASKING ----------------

function maskPhone() {
  const field = document.getElementById("phone-field");

  let digits = field.value.replace(/\D/g, "").slice(0, 7);

  let mask = "+370 ";
  let firstBlock = digits.slice(0, 3).padEnd(3, "x");
  let secondBlock = digits.slice(3).padEnd(5, "x");

  field.value = `${mask}${firstBlock} ${secondBlock}`;

  if (digits.length === 7) {
    clearError(field);
    formValidity.phone = true;
  } else {
    showError(field, "Format: +370 xxx xxxxx");
    formValidity.phone = false;
  }

  updateSubmitButton();
}

// ---------------- FORM SUBMISSION ----------------

function handleContactForm(event) {
  event.preventDefault();

  const name = document.getElementById("name-field").value;
  const surname = document.getElementById("surname-field").value;
  const email = document.getElementById("email-field").value;
  const phone = document.getElementById("phone-field").value;
  const address = document.getElementById("address-field").value;
  const r1 = Number(document.getElementById("rating1-field").value);
  const r2 = Number(document.getElementById("rating2-field").value);
  const r3 = Number(document.getElementById("rating3-field").value);

  const avg = ((r1 + r2 + r3) / 3).toFixed(1);

  const avgColor =
    avg < 4 ? "red" :
    avg < 7 ? "orange" : "green";

  console.log({
    name, surname, email, phone, address, avg
  });

  const output = document.getElementById("form-output");
  output.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Surname:</strong> ${surname}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Average rating:</strong> <span style="color:${avgColor}">${avg}</span></p>
  `;

  alert("Form submitted successfully!");
}

// ---------------- EVENT LISTENERS ----------------

document.addEventListener("DOMContentLoaded", () => {
  // Names
  document.getElementById("name-field").addEventListener("input", () =>
    validateName("name-field", "name")
  );
  document.getElementById("surname-field").addEventListener("input", () =>
    validateName("surname-field", "surname")
  );

  // Email / Address
  document.getElementById("email-field").addEventListener("input", validateEmail);
  document.getElementById("address-field").addEventListener("input", validateAddress);

  // Ratings
  document.getElementById("rating1-field").addEventListener("input", () =>
    validateRating("rating1-field", "rating1")
  );
  document.getElementById("rating2-field").addEventListener("input", () =>
    validateRating("rating2-field", "rating2")
  );
  document.getElementById("rating3-field").addEventListener("input", () =>
    validateRating("rating3-field", "rating3")
  );

  // Phone
  document.getElementById("phone-field").addEventListener("input", maskPhone);

  // Submit
  document.getElementById("contactForm").addEventListener("submit", handleContactForm);
});
