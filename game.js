// ==============================================================
// Board
// ==============================================================
let board;
let context;

const boardWidth = 500;
const boardHeight = 500;

const background = new Image();
background.src = "background.jpg";

// ==============================================================
// Player
// ==============================================================
const playerWidth = 80;
const playerHeight = 10;
const playerBorderRadius = 2;
const playerVelocityX = 10;

const player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  borderRadius: playerBorderRadius,
  velocityX: playerVelocityX,
};

// ==============================================================
// Ball
// ==============================================================
const ballRadius = 5;
const ballVelocityX = 4;
const ballVelocityY = 2;

const ballVelocity = [2.0, 1.0];
const ballPosition = [boardWidth / 2.0, boardHeight / 2.0];
// ΔT = Variação do tempo
const deltaT = 1.2;

const ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  radius: ballRadius,
  velocity: ballVelocity,
};

// ==============================================================
// Blocks
// ==============================================================
let blockArray = [];
let blockWidth = 45;
let blockHeight = 11;
let blockColumns = 10;
let blockRows = 7;
let blockMaxRows = 10;
let blockCount = 0;

const blockX = 15;
const blockY = 45;

const colors = [
  "#DC143C",
  "#FF4500",
  "#FFD700",
  "#228B22",
  "#2626F6",
  "#8A2BE2",
  "#00BFFF",
];

// ==============================================================
// Game
// ==============================================================
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");
  context.drawImage(background, 0, 0);

  // Draw player
  context.fillStyle = "skyblue";
  context.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(updateFrame);
  document.addEventListener("mousemove", movePlayer);

  // Blocks
  createBlocks();
};

function updateFrame() {
  requestAnimationFrame(updateFrame);
  context.clearRect(0, 0, board.width, board.height);
  context.drawImage(background, 0, 0);

  context.fillStyle = "skyblue";
  context.beginPath();
  context.roundRect(
    player.x,
    player.y,
    player.width,
    player.height,
    player.borderRadius
  );
  context.fill();

  context.fillStyle = "white";
  ball.x += ball.velocity[0] * deltaT;
  ball.y += ball.velocity[1] * deltaT;

  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  context.fill();

  // Check board colisions
  if (ball.y - ball.radius <= 0) {
    const normal = [0.0, 1.0];
    ball.velocity = reflection(ball.velocity, normal);
  } else if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= boardWidth) {
    const normal = [1.0, 0.0];
    ball.velocity = reflection(ball.velocity, normal);
  } else if (ball.y + ball.radius >= boardHeight) {
    // Game over
  }

  // Check player colision
  if (topColision(ball, player) || bottomColision(ball, player)) {
    const normal = [0.0, 1.0];
    ball.velocity = reflection(ball.velocity, normal);
  } else if (leftColision(ball, player) || rightColision(ball, player)) {
    const normal = [1.0, 0.0];
    ball.velocity = reflection(ball.velocity, normal);
  }

  // Redraw blokcs
  for (let i = 0; i < blockArray.length; i++) {
    const block = blockArray[i];
    context.fillStyle = block.color;
    context.beginPath();
    if (!block.break) {
      if (topColision(ball, block) || bottomColision(ball, block)) {
        const normal = [0.0, 1.0];
        ball.velocity = reflection(ball.velocity, normal);
        block.break = true;
        blockCount -= 1;
      } else if (leftColision(ball, block) || rightColision(ball, block)) {
        const normal = [1.0, 0.0];
        ball.velocity = reflection(ball.velocity, normal);
        block.break = true;
        blockCount -= 1;
      }
      context.roundRect(block.x, block.y, block.width, block.height, 2);
      context.fill();
    }
  }
}

function outOfBounds(xPos) {
  return xPos < 0 || xPos + playerWidth > boardWidth;
}

function movePlayer(event) {
  const nextXPos = event.clientX - boardWidth;
  if (!outOfBounds(nextXPos)) player.x = nextXPos;
}

function detectColision(ball, block) {
  return (
    ball.x - ball.radius < block.x + block.width &&
    ball.x + ball.radius > block.x &&
    ball.y - ball.radius < block.y + block.height &&
    ball.y + ball.radius > block.y
  );
}

function topColision(ball, block) {
  return detectColision(ball, block) && ball.y + ball.radius >= block.y;
}

function bottomColision(ball, block) {
  return (
    detectColision(ball, block) &&
    ball.y - ball.radius <= block.y + block.height
  );
}

function leftColision(ball, block) {
  return detectColision(ball, block) && ball.x + ball.radius >= block.x;
}

function rightColision(ball, block) {
  return (
    detectColision(ball, block) && ball.x - ball.radius <= block.x + block.width
  );
}

function createBlocks() {
  blockArray = [];
  for (let c = 0; c < blockColumns; c++) {
    for (let r = 0; r < blockRows; r++) {
      let block = {
        x: blockX + c * blockWidth + c * 3,
        y: blockY + r * blockHeight + r * 3,
        width: blockWidth,
        height: blockHeight,
        break: false,
        color: colors[r],
      };
      blockArray.push(block);
    }
  }
  blockCount = blockArray.length;
}

/**
 * The dotProduct function calculates the dot product of two vectors.
 * @param vector1 - The parameter `vector1` represents the first vector in the dot product calculation.
 * It is an array of numbers.
 * @param vector2 - The above code has a typo in the loop. It should be `vector2[i]` instead of
 * `vector2[2]`. The correct code should be:
 * @returns The dot product of the two input vectors.
 */
function dotProduct(vector1, vector2) {
  let dot = 0;
  for (let i = 0; i < vector1.length; i++) {
    dot += vector1[i] * vector2[i];
  }
  return dot;
}

/**
 * The projection function calculates the projection of a vector onto a given base vector.
 * @param vector - The vector parameter represents the vector that we want to project onto the base
 * vector.
 * @param base - The base parameter is an array representing the base vector.
 * @returns the projection of the vector onto the base.
 */
function projection(vector, base) {
  const dot = dotProduct(vector, base);
  const projection = base.map((c) => c * dot);
  return projection;
}

/**
 * The reflection function calculates the reflection of a velocity vector off a given normal vector.
 * @param velocity - The velocity parameter represents the initial velocity vector of an object. It is
 * a vector that describes the direction and magnitude of the object's motion.
 * @param normal - The "normal" parameter represents the normal vector of the surface that the velocity
 * vector is reflecting off of. The normal vector is a vector that is perpendicular to the surface at a
 * given point.
 * @returns the reflected velocity vector.
 */
function reflection(velocity, normal) {
  const proj = projection(velocity, normal);
  const reflect = [];
  for (let i = 0; i < velocity.length; i++) {
    reflect[i] = velocity[i] - 2 * proj[i];
  }
  return reflect;
}
