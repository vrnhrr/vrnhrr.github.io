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

