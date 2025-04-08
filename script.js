const puzzle = document.getElementById("puzzle");
const shuffleBtn = document.getElementById("shuffleBtn");
const restartBtn = document.getElementById("restartBtn");
const winMessage = document.getElementById("winMessage");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");

let tiles = [];
let moveCount = 0;
let seconds = 0;
let timer;
let isPlaying = false;

function createTiles() {
    tiles = [];
    for(let i=1; i<= 15; i++) {
        tiles.push(i);
    }
    tiles.push("");
}

function renderTiles() {
    puzzle.innerHTML = "";
    tiles.forEach((val, index) => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        if(val === "") {
            tile.classList.add("empty");
        }
        else {
            tile.textContent = val;
            tile.addEventListener("click", () => moveTile(index));
        }
        puzzle.appendChild(tile);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf("");
    const validMoves = [index - 1, index + 1, index - 4, index + 4];

    if(validMoves.includes(emptyIndex)) {

        if(
            (index % 4 === 0 && emptyIndex === index - 1) ||
            (index % 4 === 3 && emptyIndex === index + 1)
        ) {
            return;
        }

        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        moveCount++;
        updateMoves();
        renderTiles();
        checkWin();
    }
}

function shuffleTiles() {
    winMessage.textContent = "";
    moveCount = 0;
    updateMoves();
    seconds = 0;
    upadateTimerDisplay();
    clearInterval(timer);
    do {
        for(let i = tiles.length - 1; i>0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
    } while (!isSolvable(tiles));
    renderTiles();
    startTimer();
    isPlaying = true;
}

function restartGame() {
    createTiles();
    renderTiles();
    moveCount = 0;
    seconds = 0;
    updateMoves();
    upadateTimerDisplay();
    winMessage.textContent = "";
    clearInterval(timer);
    isPlaying = false;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        upadateTimerDisplay();
    }, 1000);
}

function upadateTimerDisplay() {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    timerEl.textContent = `${mins}:${secs}`;
}

function updateMoves() {
    movesEl.textContent = moveCount;
}

function isSolvable(arr) {
    let invCount = 0;
    const nums = arr.filter(n => n !== "");
    for (let i = 0; i < nums.length - 1; i++) {
        for(let j = i + 1; j < nums.length; j++) {
            if(nums[i] > nums[j]) invCount++;
        }
    }
    const emptyRow = Math.floor(arr.indexOf("") / 4);
    return (invCount + emptyRow) % 2 === 0;
}

function checkWin() {
    for(let i = 0; i < 15; i++) {
        if(tiles[i] !== i + 1) return;
    }
    winMessage.textContent = "You Win!";
    clearInterval(timer);
    isPlaying = false;
}

createTiles();
renderTiles();

shuffleBtn.addEventListener("click", shuffleTiles);
restartBtn.addEventListener("click", restartGame);