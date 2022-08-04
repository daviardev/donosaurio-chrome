let groundY = 22;
let velY = 0;
let impulse = 900;
let gravity = 2500;

let rexPoxX = 42;
let rexPosY = groundY;

let groundX = 0;
let velScene = 1280 / 3;
let gameVel = 1;
let score = 0;

let stoped = false;
let jumping = false;

let timeObstacle = 2;
let timeObstacleMin = 0.7;
let timeObstacleMax = 1.8;
let timeObstacleY = 16;
let obstacles = [];

let timeWeather = 0.5;
let timeWeatherMin = 0.7;
let timeWeatherMax = 2.7;
let maxWeatherY = 270;
let minWeatherY = 100;
let weathers = [];
let velWeather = 0.5;

let container;
let rex;
let textScore;
let ground;
let gameOver;

let time = new Date();
let deltaTime = 0;

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  setTimeout(Init, 1);
} else {
  document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
  time = new Date();
  Start();
  Loop();
}

function Loop() {
  deltaTime = (new Date() - time) / 1000;
  time = new Date();
  Update();
  requestAnimationFrame(Loop);
}

function Start() {
  gameOver = document.querySelector(".game-over");
  ground = document.querySelector(".ground");
  container = document.querySelector(".container");
  textScore = document.querySelector(".score");
  rex = document.querySelector(".rex");
  document.addEventListener("keydown", HandleKeyDown);
}

function Update() {
  if (stoped) return;

  RexMove();
  MoveGround();
  CreateObstacles();
  CreateWeathers();
  MoveObstacles();
  MoveWeathers();
  DetectarColision();

  velY -= gravity * deltaTime;
}

function HandleKeyDown(ev) {
  if (ev.keyCode == "32") {
    Jump();
  }
}

function Jump() {
  if (rexPosY === groundY) {
    jumping = true;
    velY = impulse;
    rex.classList.remove("rex-run");
  }
}

function RexMove() {
  rexPosY += velY * deltaTime;
  if (rexPosY < groundY) {
    GroundTouch();
  }
  rex.style.bottom = rexPosY + "px";
}

function GroundTouch() {
  rexPosY = groundY;
  velY = 0;
  if (jumping) {
    rex.classList.add("rex-run");
  }
  jumping = false;
}

function MoveGround() {
  groundX += CalculateScrolling();
  ground.style.left = -(groundX % container.clientWidth) + "px";
}

function CalculateScrolling() {
  return velScene * deltaTime * gameVel;
}

function Crashed() {
  rex.classList.remove("rex-run");
  rex.classList.add("rex-crashed");
  stoped = true;
}

function CreateObstacles() {
  timeObstacle -= deltaTime;
  if (timeObstacle <= 0) {
    CreateObstacle();
  }
}

function CreateWeathers() {
  timeWeather -= deltaTime;
  if (timeWeather <= 0) {
    CreateWeather();
  }
}

function CreateObstacle() {
  let obstaculo = document.createElement("div");
  container.appendChild(obstaculo);
  obstaculo.classList.add("cactus");
  if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
  obstaculo.posX = container.clientWidth;
  obstaculo.style.left = container.clientWidth + "px";

  obstacles.push(obstaculo);
  timeObstacle =
    timeObstacleMin +
    (Math.random() * (timeObstacleMax - timeObstacleMin)) / gameVel;
}

function CreateWeather() {
  let weather = document.createElement("div");
  container.appendChild(weather);
  weather.classList.add("weather");
  weather.posX = container.clientWidth;
  weather.style.left = container.clientWidth + "px";
  weather.style.bottom =
    minWeatherY + Math.random() * (maxWeatherY - minWeatherY) + "px";

  weathers.push(weather);
  timeWeather =
    timeWeatherMin +
    (Math.random() * (timeWeatherMax - timeWeatherMin)) / gameVel;
}

function MoveObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    if (obstacles[i].posX < -obstacles[i].clientWidth) {
      obstacles[i].parentNode.removeChild(obstacles[i]);
      obstacles.splice(i, 1);
      WinPoints();
    } else {
      obstacles[i].posX -= CalculateScrolling();
      obstacles[i].style.left = obstacles[i].posX + "px";
    }
  }
}

function MoveWeathers() {
  for (let i = weathers.length - 1; i >= 0; i--) {
    if (weathers[i].posX < -weathers[i].clientWidth) {
      weathers[i].parentNode.removeChild(weathers[i]);
      weathers.splice(i, 1);
    } else {
      weathers[i].posX -= CalculateScrolling() * velWeather;
      weathers[i].style.left = weathers[i].posX + "px";
    }
  }
}

function WinPoints() {
  score++;
  textScore.innerText = score;
  if (score == 5) {
    gameVel = 1.5;
    container.classList.add("mediodia");
  } else if (score == 10) {
    gameVel = 2;
    container.classList.add("tarde");
  } else if (score == 20) {
    gameVel = 3;
    container.classList.add("noche");
  } else if (score == 30) {
    gameVel = 3.5;
    container.classList.add("dificil");
  } else if (score == 40) {
    gameVel = 4;
    container.classList.add("ultradificil");
  } else if (score == 50) {
    gameVel = 4.5;
    container.classList.add("megadificil");
  } else if (score == 60) {
    gameVel = 5;
    container.classList.add("giga");
  } else if (score == 70) {
    gameVel = .5;
    container.classList.add("gigachad");
  }
  ground.style.animationDuration = 1 / gameVel + "s";
}

function GameOver() {
  Crashed();
  gameOver.style.display = "block";
}

function DetectarColision() {
  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].posX > rexPoxX + rex.clientWidth) {
      break;
    } else {
      if (IsCollision(rex, obstacles[i], 10, 30, 15, 20)) {
        GameOver();
      }
    }
  }
}

function IsCollision(
  a,
  b,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft
) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height - paddingBottom < bRect.top ||
    aRect.top + paddingTop > bRect.top + bRect.height ||
    aRect.left + aRect.width - paddingRight < bRect.left ||
    aRect.left + paddingLeft > bRect.left + bRect.width
  );
}