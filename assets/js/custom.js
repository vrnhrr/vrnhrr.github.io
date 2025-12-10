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
  // COLLECT FORM VALUES
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
  // CREATE DATA OBJECT
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
  // DISPLAY DATA BELOW FORM
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
  // CALCULATE AVERAGE RATING
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
  // SUCCESS POPUP
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

// ======================================================
// OPTIONAL TASKS
// ======================================================

// Track validation for disabling submit button
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

// -----------------------------------------------
// Helper: Show field error
// -----------------------------------------------
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

// -----------------------------------------------
// Helper: Clear error
// -----------------------------------------------
function clearError(field) {
  field.classList.remove("is-invalid");
  const errorElem = field.nextElementSibling;
  if (errorElem && errorElem.classList.contains("error-text")) {
    errorElem.remove();
  }
}

// -----------------------------------------------
// NAME & SURNAME VALIDATION
// Letters only + required
// -----------------------------------------------
function validateName(fieldId, key) {
  const field = document.getElementById(fieldId);
  const value = field.value.trim();

  if (value === "") {
    showError(field, "This field is required.");
    formValidity[key] = false;
  } else if (!/^[A-Za-zÀ-ž\s-]+$/.test(value)) {
    showError(field, "Only letters allowed.");
    formValidity[key] = false;
  } else {
    clearError(field);
    formValidity[key] = true;
  }
  updateSubmitButton();
}

// -----------------------------------------------
// EMAIL VALIDATION
// -----------------------------------------------
function validateEmail() {
  const field = document.getElementById("email-field");
  const value = field.value.trim();

  if (value === "") {
    showError(field, "Email is required.");
    formValidity.email = false;
  } else if (!/^\S+@\S+\.\S+$/.test(value)) {
    showError(field, "Invalid email format.");
    formValidity.email = false;
  } else {
    clearError(field);
    formValidity.email = true;
  }
  updateSubmitButton();
}

// -----------------------------------------------
// ADDRESS VALIDATION
// Basic check for: not empty + at least 5 chars
// -----------------------------------------------
function validateAddress() {
  const field = document.getElementById("address-field");
  const value = field.value.trim();

  if (value.length < 5) {
    showError(field, "Address must be meaningful.");
    formValidity.address = false;
  } else {
    clearError(field);
    formValidity.address = true;
  }
  updateSubmitButton();
}

// -----------------------------------------------
// RATING VALIDATION (1–10)
// -----------------------------------------------
function validateRating(fieldId, key) {
  const field = document.getElementById(fieldId);
  const value = Number(field.value);

  if (!value || value < 1 || value > 10) {
    showError(field, "Enter a number 1–10.");
    formValidity[key] = false;
  } else {
    clearError(field);
    formValidity[key] = true;
  }
  updateSubmitButton();
}

// -----------------------------------------------
// PHONE NUMBER MASKING
// Lithuania: +370 6xx xxxxx
// -----------------------------------------------
function maskPhone() {
  const field = document.getElementById("phone-field");

  // Extract digits from user input
  let digits = field.value.replace(/\D/g, "");

  // Limit to 7 digits (xx xxxxx)
  digits = digits.slice(0, 7);

  // Build the masked number
  let mask = "+370 ";

  // Fill the first block (xxx)
  let firstBlock = digits.slice(0, 3).padEnd(3, "x");

  // Fill the second block (xxxxx)
  let secondBlock = digits.slice(3).padEnd(5, "x");

  field.value = `${mask}${firstBlock} ${secondBlock}`;

  // Validation: valid if exactly 7 digits entered
  if (digits.length === 7) {
    clearError(field);
    formValidity.phone = true;
  } else {
    showError(field, "Enter a valid phone: +370 xxx xxxxx");
    formValidity.phone = false;
  }

  updateSubmitButton();
}

// -----------------------------------------------
// DISABLE SUBMIT UNTIL FORM IS VALID
// -----------------------------------------------
function updateSubmitButton() {
  const button = document.querySelector("#contactForm button");

  const allValid = Object.values(formValidity).every(v => v === true);

  button.disabled = !allValid;

  if (button.disabled) {
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
  } else {
    button.style.opacity = "1";
    button.style.cursor = "pointer";
  }
}

// -----------------------------------------------
// ADD REAL-TIME VALIDATION LISTENERS
// Call this when the page loads
// -----------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Name + surname
  document.getElementById("name-field").addEventListener("input", () =>
    validateName("name-field", "name")
  );

  document.getElementById("surname-field").addEventListener("input", () =>
    validateName("surname-field", "surname")
  );

  // Email
  document.getElementById("email-field").addEventListener("input", validateEmail);

  // Address
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

  // Phone masking
  document.getElementById("phone-field").addEventListener("input", maskPhone);

  // Initialize disabled
  updateSubmitButton();


  document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  if (!board) return; // stop if not on memory.html

  // DOM elements
  const movesDisplay = document.getElementById("moves");
  const matchesDisplay = document.getElementById("matches");
  const winMessage = document.getElementById("win-message");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const difficultySelect = document.getElementById("difficulty");
  const timerDisplay = document.getElementById("timer");
  const bestEasyDisplay = document.getElementById("best-easy");
  const bestHardDisplay = document.getElementById("best-hard");

  // At least 6 unique items (you may modify icons)
  const cardData = ["🌑", "🌕", "🌟", "🪐", "☄️", "🌙", "🌈", "💫"];

  // Game state
  let moves = 0;
  let matches = 0;
  let flippedCards = [];
  let lockBoard = false;
  let rows = 3;
  let cols = 4;

  // Timer
  let timerInterval = null;
  let elapsedSeconds = 0;

  // -------------------------------
  // Load best results
  // -------------------------------
  function loadBestScores() {
    bestEasyDisplay.textContent =
      localStorage.getItem("memoryBestMovesEasy") || "--";
    bestHardDisplay.textContent =
      localStorage.getItem("memoryBestMovesHard") || "--";
  }

  // -------------------------------
  // Timer controls
  // -------------------------------
  function updateTimerDisplay() {
    timerDisplay.textContent = elapsedSeconds + "s";
  }

  function startTimer() {
    stopTimer();
    elapsedSeconds = 0;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      elapsedSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // -------------------------------
  // Start or restart game
  // -------------------------------
  function initGame() {
    moves = 0;
    matches = 0;
    flippedCards = [];
    lockBoard = false;

    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matches;
    winMessage.textContent = "";

    // Set grid size
    if (difficultySelect.value === "easy") {
      rows = 3;
      cols = 4; // 12 cards → 6 pairs
    } else {
      rows = 4;
      cols = 6; // 24 cards → 12 pairs
    }

    generateBoard();
    restartBtn.disabled = false;
  }

  // -------------------------------
  // Generate board dynamically
  // -------------------------------
  function generateBoard() {
    board.innerHTML = "";

    const totalCards = rows * cols;
    const neededPairs = totalCards / 2;

    // Build a list of matching pairs
    let deck = [];
    for (let i = 0; i < neededPairs; i++) {
      let symbol = cardData[i % cardData.length];
      deck.push(symbol);
      deck.push(symbol);
    }

    // Shuffle
    deck.sort(() => Math.random() - 0.5);

    // Apply CSS grid
    board.style.gridTemplateColumns = `repeat(${cols}, 70px)`;

    deck.forEach((symbol) => {
      const card = document.createElement("div");
      card.classList.add("memory-card");
      card.dataset.value = symbol;

      const inner = document.createElement("div");
      inner.classList.add("memory-card-inner");

      const front = document.createElement("div");
      front.classList.add("memory-card-front");
      front.textContent = "?";

      const back = document.createElement("div");
      back.classList.add("memory-card-back");
      back.textContent = symbol;

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);

      card.addEventListener("click", () => flipCard(card));
      board.appendChild(card);
    });
  }

  // -------------------------------
  // Card flipping logic
  // -------------------------------
  function flipCard(card) {
    if (lockBoard) return;
    if (card.classList.contains("flipped")) return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      moves++;
      movesDisplay.textContent = moves;
      checkMatch();
    }
  }

  // -------------------------------
  // Check match
  // -------------------------------
  function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
      matches++;
      matchesDisplay.textContent = matches;
      flippedCards = [];

      // Win condition
      const totalPairs = (rows * cols) / 2;
      if (matches === totalPairs) {
        handleWin();
      }
    } else {
      lockBoard = true;
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }

  // -------------------------------
  // Win message + best score storage
  // -------------------------------
  function handleWin() {
    stopTimer();
    winMessage.textContent = "🎉 You Won!";

    const storageKey =
      difficultySelect.value === "easy"
        ? "memoryBestMovesEasy"
        : "memoryBestMovesHard";

    const previous = localStorage.getItem(storageKey);

    if (!previous || moves < Number(previous)) {
      localStorage.setItem(storageKey, moves);
    }

    loadBestScores();
  }

  // -------------------------------
  // Event listeners
  // -------------------------------
  startBtn.addEventListener("click", () => {
    initGame();
    startTimer();
  });

  restartBtn.addEventListener("click", () => {
    initGame();
    startTimer();
  });

  difficultySelect.addEventListener("change", () => {
    stopTimer();
    initGame();
  });

  // Initialize best scores display
  loadBestScores();
});

});

