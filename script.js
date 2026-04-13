aaconst canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const size = 400;

let snake, direction, food, bombs, obstacles;
let score, level, speed, game, running = false;

const fruits = ["🍎","🍌","🍇","🍊","🍉"];

const eatSound = document.getElementById("eatSound");
const bombSound = document.getElementById("bombSound");

function init() {
  snake = [{x: 200, y: 200}];
  direction = "RIGHT";
  score = 0;
  level = 1;
  bombs = [];
  obstacles = [];
  speed = parseInt(document.getElementById("difficulty").value);

  spawnFood();
  spawnObstacles();
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box,
    type: fruits[Math.floor(Math.random()*fruits.length)]
  };
}

function spawnObstacles() {
  obstacles = [];
  bombs = [];

  for (let i = 0; i < level; i++) {
    obstacles.push({
      x: Math.floor(Math.random()*20)*box,
      y: Math.floor(Math.random()*20)*box
    });
  }

  for (let i = 0; i < Math.floor(level/3); i++) {
    bombs.push({
      x: Math.floor(Math.random()*20)*box,
      y: Math.floor(Math.random()*20)*box
    });
  }
}

function startGame() {
  init();
  running = true;
  clearInterval(game);
  game = setInterval(draw, speed);
}

function pauseGame() {
  running = false;
}

function resumeGame() {
  running = true;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function draw() {
  if (!running) return;

  let bgColor = document.getElementById("bgColor").value;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  let snakeColor = document.getElementById("snakeColor").value;

  // Snake
  snake.forEach((p,i)=>{
    ctx.fillStyle = snakeColor;
    ctx.fillRect(p.x, p.y, box, box);
  });

  // Real-looking fruit (emoji)
  ctx.font = "20px Arial";
  ctx.fillText(food.type, food.x, food.y + 18);

  // Obstacles
  ctx.fillStyle = "gray";
  obstacles.forEach(o=>{
    ctx.fillRect(o.x, o.y, box, box);
  });

  // Bombs
  ctx.fillStyle = "red";
  bombs.forEach(b=>{
    ctx.fillRect(b.x, b.y, box, box);
  });

  let head = {...snake[0]};

  if (direction==="LEFT") head.x -= box;
  if (direction==="RIGHT") head.x += box;
  if (direction==="UP") head.y -= box;
  if (direction==="DOWN") head.y += box;

  // Eat fruit
  if (head.x === food.x && head.y === food.y) {
    score++;
    eatSound.play();
    spawnFood();

    // Level up every 5 points
    if (score % 5 === 0 && level < 100) {
      level++;
      document.getElementById("levelText").innerText = "Level " + level;
      spawnObstacles();
    }
  } else {
    snake.pop();
  }

  // Bomb collision
  for (let b of bombs) {
    if (head.x === b.x && head.y === b.y) {
      bombSound.play();
      gameOver();
      return;
    }
  }

  // Obstacle collision
  for (let o of obstacles) {
    if (head.x === o.x && head.y === o.y) {
      gameOver();
      return;
    }
  }

  // Wall or self
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= size || head.y >= size ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);
  document.getElementById("score").innerText = score;
}

function gameOver() {
  clearInterval(game);
  alert("Game Over at Level " + level + " | Score: " + score);
}