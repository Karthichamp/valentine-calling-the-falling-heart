const basket = document.getElementById("basket");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const missedDisplay = document.getElementById("missed");
const message = document.getElementById("message");

let score = 0;
let missed = 0;
let basketX = window.innerWidth / 2 - 50;
let gameRunning = true;

/*********************************
 🏆 HIGH SCORE MEMORY
**********************************/
let highScore = localStorage.getItem("loveHighScore") || 0;

const highScoreDisplay = document.createElement("p");
highScoreDisplay.innerHTML = "High Score: " + highScore;
document.querySelector(".info").appendChild(highScoreDisplay);

/*********************************
 🖱 DESKTOP CONTROLS
**********************************/
document.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;
  basketX = e.clientX - 50;
  basket.style.left = basketX + "px";
});

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft") basketX -= 40;
  if (e.key === "ArrowRight") basketX += 40;
  basket.style.left = basketX + "px";
});

/*********************************
 📱 MOBILE TOUCH CONTROLS
**********************************/
document.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  const touch = e.touches[0];
  basketX = touch.clientX - 50;
  basket.style.left = basketX + "px";
});

/*********************************
 💖 CREATE FALLING HEARTS
**********************************/
function createHeart() {
  if (!gameRunning) return;

  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "💖";
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.top = "0px";
  heart.style.animationDuration = (Math.random() * 2 + 3) + "s";
  gameContainer.appendChild(heart);

  let fallInterval = setInterval(() => {
    const heartRect = heart.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    // Catch heart
    if (
      heartRect.bottom >= basketRect.top &&
      heartRect.left < basketRect.right &&
      heartRect.right > basketRect.left
    ) {
      score++;
      scoreDisplay.textContent = score;
      heart.remove();
      clearInterval(fallInterval);

      if (score >= 20) winGame();
    }

    // Miss heart
    if (heartRect.top > window.innerHeight) {
      missed++;
      missedDisplay.textContent = missed;
      heart.remove();
      clearInterval(fallInterval);

      if (missed >= 5) gameOver();
    }
  }, 50);
}

/*********************************
 ✨ CONFETTI EFFECT
**********************************/
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.innerHTML = "💖";
    confetti.style.position = "fixed";
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.top = "-20px";
    confetti.style.fontSize = Math.random() * 20 + 10 + "px";
    confetti.style.animation = "confettiFall 3s linear forwards";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 3000);
  }
}

/*********************************
 💍 SECRET PROPOSAL ENDING
**********************************/
function winGame() {
  gameRunning = false;
  clearInterval(gameLoop);

  if (score > highScore) {
    localStorage.setItem("loveHighScore", score);
  }

  message.innerHTML = `
    💕 You caught my heart! 💕 <br><br>
    I have something to ask you... 💍 <br><br>
    <button id="proposalBtn">Click Here</button>
  `;
  message.classList.remove("hidden");

  launchConfetti();

  document.getElementById("proposalBtn").addEventListener("click", () => {
    message.innerHTML = `
      Will you be mine forever Babyy? 💖 <br><br>
      <button onclick="finalYes()">YES 💍</button>
    `;
  });
}

function finalYes() {
  message.innerHTML = `
    Forever and always. Be in ❤️ heart Babyyyy<br>
    You are my everything.
  `;
  launchConfetti();
}

/*********************************
 ❌ GAME OVER
**********************************/
function gameOver() {
  gameRunning = false;
  clearInterval(gameLoop);

  if (score > highScore) {
    localStorage.setItem("loveHighScore", score);
  }

  message.textContent = "Oops! But you’ll always have my heart ❤️";
  message.classList.remove("hidden");
}

/*********************************
 🚀 START GAME LOOP
**********************************/
let gameLoop = setInterval(createHeart, 800);
