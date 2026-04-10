/*
Copyright 2026 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Configuration State
let config = {
  title: "John & Ana's Baby Shower",
  hint: "👶 Guess the Name! 👶",
  theme: "boy",
  suffix: "Smith",
  mode: "auto",
  answer: "BABY",
  initialTiles: 5,
  maxSnapshots: 1
};

// Game State
let currentTool = "white";

function applyConfig() {
  config.title = document.getElementById("cfg-title").value;
  const themeStyle = document.getElementById("cfg-theme-style").value;
  config.suffix = document.getElementById("cfg-suffix").value;
  config.mode = document.getElementById("cfg-mode").value;
  config.answer = document.getElementById("cfg-answer").value.toUpperCase();
  config.initialTiles = parseInt(document.getElementById("cfg-initial-tiles").value) || 5;
  config.maxSnapshots = parseInt(document.getElementById("cfg-max-snapshots").value) || 1;

  // Handle merged Theme & Style
  if (themeStyle === "boy") {
    config.theme = "boy";
    config.hint = "👶 Guess the Name! 👶";
  } else if (themeStyle === "girl") {
    config.theme = "girl";
    config.hint = "👶 Guess the Name! 👶";
  } else if (themeStyle === "neutral") {
    config.theme = "neutral";
    config.hint = "Guess the Name!";
  }

  // Apply to UI
  document.getElementById("event-title").innerText = config.title;
  document.getElementById("gender-hint").innerText = config.hint;

  const suffixEl = document.getElementById("suffix-le");
  suffixEl.innerText = config.suffix;
  suffixEl.style.display = config.suffix.trim() !== "" ? "flex" : "none";

  // Theme classes
  document.body.classList.remove("theme-girl", "theme-neutral");
  if (config.theme === "girl") {
    document.body.classList.add("theme-girl");
  } else if (config.theme === "neutral") {
    document.body.classList.add("theme-neutral");
  }

  // Mode specific UI
  const answerLabel = document.getElementById("cfg-answer-label");
  const initialTilesLabel = document.getElementById("cfg-initial-tiles-label");
  const palette = document.querySelector(".palette");

  if (config.mode === "auto") {
    answerLabel.style.display = "block";
    initialTilesLabel.style.display = "none";
    palette.style.display = "none";
    syncBoardLengthToAnswer();
  } else {
    answerLabel.style.display = "none";
    initialTilesLabel.style.display = "block";
    palette.style.display = "flex";
  }
}

function syncBoardLengthToAnswer() {
  if (config.mode !== "auto") return;
  const board = document.getElementById("board");
  const tiles = board.querySelectorAll(".tile");
  const targetLen = config.answer.length;

  if (tiles.length < targetLen) {
    for (let i = tiles.length; i < targetLen; i++) {
      addLetter();
    }
  } else if (tiles.length > targetLen) {
    for (let i = tiles.length; i > targetLen; i--) {
      removeLetter();
    }
  }
}

function toggleConfig() {
  const menu = document.getElementById("config-menu");
  const backdrop = document.getElementById("backdrop");

  const isHidden = window.getComputedStyle(menu).display === "none";

  if (isHidden) {
    menu.style.display = "block";
    backdrop.style.display = "block";
  } else {
    menu.style.display = "none";
    backdrop.style.display = "none";
  }
}

function applyAndClose() {
  toggleConfig();
  resetBoard();
}

function setTool(color) {
  currentTool = color;
  // Update active class in palette
  document.querySelectorAll(".palette-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`.palette-${color}`).classList.add("active");
}

function onTileClick(tile) {
  if (config.mode === "auto") return; // No manual coloring in auto mode

  // Apply color based on current tool
  tile.classList.remove("correct", "present");
  tile.contentEditable = "true"; // Default to editable

  if (currentTool === "green") {
    tile.classList.add("correct");
    tile.contentEditable = "false"; // Readonly if green
  } else if (currentTool === "yellow") {
    tile.classList.add("present");
  }

  updateCongratsDisplay();
}

// Helper: Check if all letters are green and show congrats
function updateCongratsDisplay() {
  const board = document.getElementById("board");
  const snapshotsContainer = document.getElementById("snapshots");

  const tiles = board.querySelectorAll(".tile");
  let allCorrect = true;

  // If no tiles, it's not "all correct"
  if (tiles.length === 0) return false;

  tiles.forEach((tile) => {
    if (!tile.classList.contains("correct")) {
      allCorrect = false;
    }
  });

  if (allCorrect) {
    snapshotsContainer.replaceChildren();
    const congrats = document.createElement("div");
    congrats.style.fontSize = "5rem";
    congrats.innerText = "🎉🥳👏";
    congrats.id = "congrats-message";
    congrats.setAttribute("aria-live", "polite");
    congrats.setAttribute("aria-label", "Congratulations! All letters correct.");
    snapshotsContainer.appendChild(congrats);
    return true;
  } else {
    // Remove congrats if it was there and we are no longer all correct
    const congrats = document.getElementById("congrats-message");
    if (congrats) {
      congrats.remove();
    }
  }
  return false;
}

function evaluateGuess() {
  const board = document.getElementById("board");
  const tiles = board.querySelectorAll(".tile");
  const answer = config.answer.toUpperCase();

  // Reset colors and editability first
  tiles.forEach(tile => {
    tile.classList.remove("correct", "present");
    tile.contentEditable = "true";
  });

  let answerFlags = new Array(answer.length).fill(false);
  let guessFlags = new Array(tiles.length).fill(false);

  // Greens
  for (let i = 0; i < tiles.length && i < answer.length; i++) {
    if (tiles[i].innerText.toUpperCase() === answer[i]) {
      tiles[i].classList.add("correct");
      tiles[i].contentEditable = "false"; // Make read-only if green
      answerFlags[i] = true;
      guessFlags[i] = true;
    }
  }

  // Yellows
  for (let i = 0; i < tiles.length; i++) {
    if (guessFlags[i]) continue;
    let letter = tiles[i].innerText.toUpperCase();
    for (let j = 0; j < answer.length; j++) {
      if (!answerFlags[j] && answer[j] === letter) {
        tiles[i].classList.add("present");
        answerFlags[j] = true;
        break;
      }
    }
  }
  updateCongratsDisplay();
}

function captureSnapshot() {
  const board = document.getElementById("board");
  const snapshotsContainer = document.getElementById("snapshots");

  const isWin = updateCongratsDisplay();
  if (isWin) return; // Don't create snapshot if won

  // Respect max snapshots
  while (snapshotsContainer.children.length >= config.maxSnapshots) {
    snapshotsContainer.removeChild(snapshotsContainer.firstChild);
  }

  const snapshotBoard = document.createElement("div");
  snapshotBoard.className = "snapshot-board";

  // Clone the tiles and suffix
  const tiles = board.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    const clonedTile = document.createElement("div");
    // Remove shake class if present so snapshot doesn't shake
    clonedTile.className = tile.className.replace("shake", "").trim();
    clonedTile.innerText = tile.innerText;
    clonedTile.setAttribute("data-index", tile.getAttribute("data-index"));
    snapshotBoard.appendChild(clonedTile);
  });

  const suffix = document.getElementById("suffix-le");
  const clonedSuffix = document.createElement("div");
  clonedSuffix.className = suffix.className;
  clonedSuffix.innerText = suffix.innerText;
  snapshotBoard.appendChild(clonedSuffix);

  snapshotsContainer.appendChild(snapshotBoard);
}

// Helper: Focus a tile and move cursor to the end
function focusTileAndMoveCursorToEnd(tile) {
  tile.focus();
  let range = document.createRange();
  let sel = window.getSelection();
  range.selectNodeContents(tile);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function onTileInput(tile) {
  // Keep only the last character and uppercase it
  let text = tile.innerText.trim();
  if (text.length > 0) {
    tile.innerText = text[text.length - 1].toUpperCase();

    // Move focus to next tile if available
    let next = tile.nextElementSibling;
    if (next && next.classList.contains("tile")) {
      // We need to wait a bit for the cursor to be set
      setTimeout(() => {
        focusTileAndMoveCursorToEnd(next);
      }, 10);
    }
  }
}

function addLetter() {
  const board = document.getElementById("board");
  const suffix = document.getElementById("suffix-le");

  const newTile = document.createElement("div");
  newTile.className = "tile";
  newTile.contentEditable = "true";

  newTile.addEventListener("input", () => onTileInput(newTile));
  newTile.addEventListener("click", () => onTileClick(newTile));

  // Set index for the tile
  const existingTiles = board.querySelectorAll(".tile");
  newTile.setAttribute("data-index", existingTiles.length + 1);

  board.insertBefore(newTile, suffix);
  updateCongratsDisplay();
}

function removeLetter() {
  const board = document.getElementById("board");
  const tiles = board.querySelectorAll(".tile");
  if (tiles.length > 1) {
    board.removeChild(tiles[tiles.length - 1]);
    updateCongratsDisplay();
  }
}

function resetBoard() {
  const board = document.getElementById("board");
  const tiles = board.querySelectorAll(".tile");
  tiles.forEach((tile) => board.removeChild(tile));

  // Add back initial tiles
  const count = config.mode === "manual" ? config.initialTiles : config.answer.length;
  for (let i = 0; i < count; i++) {
    addLetter();
  }
  updateCongratsDisplay();
}

function toggleFullScreen() {
  let elem = document.documentElement;
  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// Handle backspace and enter keys
document.addEventListener("keydown", function (e) {
  if (e.key === "Backspace") {
    const activeElem = document.activeElement;
    if (activeElem && activeElem.classList.contains("tile") && activeElem.innerText === "") {
      let prev = activeElem.previousElementSibling;
      if (prev && prev.classList.contains("tile")) {
        focusTileAndMoveCursorToEnd(prev);
      }
    }
  } else if (e.key === "Enter") {
    const board = document.getElementById("board");
    const tiles = board.querySelectorAll(".tile");

    if (config.mode === "auto") {
      evaluateGuess();
    }

    // Trigger shake for yellow and white tiles (not correct) in auto mode
    if (config.mode === "auto") {
      tiles.forEach(tile => {
        if (!tile.classList.contains("correct")) {
          tile.classList.add("shake");
          setTimeout(() => tile.classList.remove("shake"), 500);
        }
      });
    }

    captureSnapshot();
    e.preventDefault(); // Prevent newline in contenteditable
  }
});

function setupEventListeners() {
  // Config Inputs
  document.getElementById("cfg-title").addEventListener("input", applyConfig);
  document.getElementById("cfg-theme-style").addEventListener("change", applyConfig);
  document.getElementById("cfg-suffix").addEventListener("input", applyConfig);
  document.getElementById("cfg-mode").addEventListener("change", applyConfig);
  document.getElementById("cfg-answer").addEventListener("input", applyConfig);
  document.getElementById("cfg-initial-tiles").addEventListener("input", applyConfig);
  document.getElementById("cfg-max-snapshots").addEventListener("input", applyConfig);

  // Buttons
  document.getElementById("toggle-config-btn").addEventListener("click", applyAndClose);
  document.getElementById("backdrop").addEventListener("click", toggleConfig);

  // Palette
  document.getElementById("btn-palette-white").addEventListener("click", () => setTool("white"));
  document.getElementById("btn-palette-green").addEventListener("click", () => setTool("green"));
  document.getElementById("btn-palette-yellow").addEventListener("click", () => setTool("yellow"));

  // Controls
  document.getElementById("btn-add-letter").addEventListener("click", addLetter);
  document.getElementById("btn-remove-letter").addEventListener("click", removeLetter);
  document.getElementById("btn-snapshot").addEventListener("click", captureSnapshot);
  document.getElementById("btn-reset").addEventListener("click", resetBoard);
  document.getElementById("btn-settings").addEventListener("click", toggleConfig);
  document.getElementById("btn-fullscreen").addEventListener("click", toggleFullScreen);
}

// Initialize Game
function init() {
  setupEventListeners();
  applyConfig();
  resetBoard();
}

// Run initialization
init();
