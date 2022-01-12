// game constants & variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("../assets/eat.wav");
const gameOverSound = new Audio("../assets/bumped.wav");
const moveSound = new Audio("../assets/move.wav");
let speed = 8;
let lastPaintTime = 0;
let score = 0;
let info = document.querySelector(".info");
let gameOver = document.querySelector(".gameOver");
let widthSm = window.screen.width;

// the x and y axis in the java script is the top left corner of the screen where the element is srarted
let snakeArr = [{ x: 13, y: 15 }];

// food is not an array, it is an partical
let food = { x: 6, y: 7 };

// Game functions
function main(ctime) {
  window.requestAnimationFrame(main);
  // console.log(ctime);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // if snake bumped itself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  //  if snake bump into the wall (on mobile screen)
  if (widthSm <= 450) {
    if (
      snake[0].x >= 26 ||
      snake[0].x <= 0 ||
      snake[0].y >= 36 ||
      snake[0].y <= 0
    ) {
      return true;
    }
  }

  //  if snake bump into the wall (on desktop)
  else if (
    snake[0].x >= 26 ||
    snake[0].x <= 0 ||
    snake[0].y >= 26 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  // part 1: updating the snake array & food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    inputDir = { x: 0, y: 0 };
    // alert("Game Over!!!. Press any key to play again.");
    gameOver.style.display = "block";

    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
  }

  // if snake eaten the food, increment the score and regenerete the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    //  adding high score to the scoreboard
    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("HighScore", JSON.stringify(highScoreVal));
      highScoreBox.innerHTML = "High Score: " + highScoreVal;
    }
    scoreBox.innerHTML = "Your Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    // if we want to generate the random number in between a and b then:-
    // a + (b - a) * Math.round();

    // the a and b depends on grid size of the board in this case gird size is 25 so the number is start form (0 to 25)
    let a = 1;
    let b = 25;
    if (widthSm <= 450) {
      let c = 35;
      food = {
        x: Math.round(a + (b - a) * Math.random()), // math.random can create any number b\w (0 to 1) randomly
        y: Math.round(a + (c - a) * Math.random()),
      };
    } else {
      food = {
        x: Math.round(a + (b - a) * Math.random()), // math.random can create any number b\w (0 to 1) randomly
        y: Math.round(a + (b - a) * Math.random()),
      };
    }
  }

  // movment of snake
  // reverse forloop to get the second last element of the snake and itrrate every element from the last to first and move one by one
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    // we cant put value in this manner, we use destructuring and have to make new object using 3 dot(...)
    // snakeArr[i + 1] = snakeArr[i];
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // part 2: Display the snake and Food

  // Display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // Display the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

//  main logic here

// Adding high score to the local storage
let highScore = localStorage.getItem("HighScore");
if (highScore === null) {
  highScoreVal = 0;
  localStorage.setItem("HighScore", JSON.stringify(highScoreVal));
} else {
  highScoreVal = JSON.parse(highScore);
  highScoreBox.innerHTML = "High Score: " + highScore;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  // hide the info tab
  info.style.display = "none";
  gameOver.style.display = "none";

  inputDir = { x: 0, y: 1 }; // start the game(press any key)
  moveSound.play();

  switch (e.key) {
    case "ArrowUp":
      // console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;

      break;

    case "ArrowDown":
      // console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1;

      break;

    case "ArrowLeft":
      // console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    case "ArrowRight":
      // console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      break;

    default:
      break;
  }
});

// ************** touch support programm ****************

// variables for touch support
let startingX, startingY, movingX, movingY;

// Disable context menu (on right click (desable all the options))
window.oncontextmenu = function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

window.addEventListener("touchstart", touchstart);
window.addEventListener("touchend", touchend);
window.addEventListener("touchmove", touchmove);

function touchstart(e) {
  // hide the info tab
  info.style.display = "none";
  gameOver.style.display = "none";

  startingX = e.touches[0].clientX;
  startingY = e.touches[0].clientY;
}

function touchmove(e) {
  e.stopImmediatePropagation();

  movingX = e.touches[0].clientX;
  movingY = e.touches[0].clientY;
}

function touchend() {
  moveSound.play();
  if (startingX + 50 < movingX) {
    // console.log("right", startingX, movingX);
    inputDir.x = 1;
    inputDir.y = 0;
  } else if (startingX - 50 > movingX) {
    // console.log("left");
    inputDir.x = -1;
    inputDir.y = 0;
  }
  if (startingY + 50 < movingY) {
    // console.log("down");
    inputDir.x = 0;
    inputDir.y = 1;
  } else if (startingY - 50 > movingY) {
    // console.log("up", startingY, movingY);
    inputDir.x = 0;
    inputDir.y = -1;
  }
}
