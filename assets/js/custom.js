// ----------------------------
// CONTACT FORM HANDLER
// ----------------------------
function handleContactForm() {
  console.clear(); // optional, just cleans the console

  // Prevent template "loading" messages from showing
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".error-message").style.display = "none";
  document.querySelector(".sent-message").style.display = "none";

  // ----------------------------
  // 1. COLLECT FORM VALUES
  // ----------------------------
  const name = document.getElementById("name-field").value.trim();
  const surname = document.getElementById("surname-field").value.trim();
  const email = document.getElementById("email-field").value.trim();
  const phone = document.getElementById("phone-field").value.trim();
  const address = document.getElementById("address-field").value.trim();
  const rating1 = Number(document.getElementById("rating1-field").value);
  const rating2 = Number(document.getElementById("rating2-field").value);
  const rating3 = Number(document.getElementById("rating3-field").value);
  const message = document.getElementById("message-field").value.trim();

  // ----------------------------
  // 2. CREATE DATA OBJECT
  // ----------------------------
  const formData = {
    name,
    surname,
    email,
    phone,
    address,
    rating1,
    rating2,
    rating3,
    message,
  };

  console.log("Submitted form data:", formData);

  // ----------------------------
  // 3. DISPLAY DATA BELOW FORM
  // ----------------------------
  const resultsDiv = document.getElementById("form-results");

  let html = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Surname:</strong> ${surname}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone Number:</strong> ${phone}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Message:</strong> ${message || "(none)"}</p>
  `;

  // ----------------------------
  // 4. CALCULATE AVERAGE RATING
  // ----------------------------
  const avg = ((rating1 + rating2 + rating3) / 3).toFixed(1);

  // Choose color
  let color = "black";
  if (avg < 4) color = "red";
  else if (avg < 7) color = "orange";
  else color = "green";

  html += `<p><strong>Average Rating:</strong> <span style="color:${color}">${name} ${surname}: ${avg}</span></p>`;

  resultsDiv.innerHTML = html;

  // ----------------------------
  // 5. SHOW SUCCESS POPUP
  // ----------------------------
  showSuccessPopup("Form submitted successfully!");
}

// ----------------------------
// CUSTOM POPUP FUNCTION
// ----------------------------
function showSuccessPopup(message) {
  // Create popup container
  const popup = document.createElement("div");
  popup.textContent = message;

  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.padding = "15px 25px";
  popup.style.background = "var(--accent-color)";
  popup.style.color = "white";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  popup.style.fontFamily = "var(--default-font)";
  popup.style.fontSize = "16px";
  popup.style.zIndex = "99999";
  popup.style.opacity = "0";
  popup.style.transition = "opacity 0.3s ease";

  document.body.appendChild(popup);

  // Fade-in
  setTimeout(() => {
    popup.style.opacity = "1";
  }, 50);

  // Fade-out and remove
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 300);
  }, 2500);
}
