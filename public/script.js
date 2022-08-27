const parpoint = document.getElementById("Mxscore");
const parspeed = document.getElementById("curSpeed");
const restar = document.getElementById("Rmenu");
const parMain = document.getElementById("MainR");
const parGname = document.getElementById("Gname");
const parRbtn = document.getElementById("Restartbutton");

restar.style.width = `${screen.width / 2.5}px`
restar.style.height = `${screen.height / 3 + 2}px`;
restar.style.borderStyle = "solid";

let Mxscore = 0;
let curSpeed = 1;

let obstacles = [];
let data = [];
const storagescore = localStorage.getItem("mxscore");
if (storagescore !== null) { Mxscore = parseInt(storagescore); }

refreshUI();

let doSend=0;

async function sendData() {
  if(doSend===1){return;}
  doSend=1;
  //console.log("here");
  for (let i = 0; i < data.length; i++) {
    await fetch(`/api/people`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: data[i].score,
        name: data[i].name
      })
    });
  }
  doSend=0;
  data = [];
}

setInterval(sendData, 150);

function resetScore() {
  localStorage.removeItem("mxscore");
  Mxscore = 0;
  refreshUI();
}

function refreshUI() {
  parpoint.innerText = Mxscore;
  parspeed.innerText = curSpeed;
}
window.addEventListener('keyup', function (e) {
  if (e.key === " ") { ok2 = 1; }
  else { gamearea.keys[e.keyCode] = false; }
})


parGname.addEventListener("focusin", () => {
  Fform = 1;
  if (ok1 === 0) { stopitems(); ok1 = 1; ok2 = 1 }
})
parGname.addEventListener("focusout", () => {
  Fform = 0;
})
parRbtn.addEventListener("click", () => {
  Restart();
})

window.addEventListener('keydown', function (e) {
  if (Fform === 1) { return; }
  if (e.keyCode === 38) { addSpeed(1); }
  if (e.keyCode === 40) { addSpeed(-1); }
  if (e.key.toLowerCase() === "r") {
    gamearea.keys[e.keyCode] = true;
    Restart();
  }
  if (e.key === " " && ok1 === 0) {
    if (parMain.style.opacity !== "0") { return; }
    stopitems();
    ok1 = 1;
  }
  else if (e.key === " " && ok1 === 1 && ok2 === 1) {
    if (parMain.style.opacity !== "0") { return; }
    ok1 = 0;
    ok2 = 0;
  }
  else {
    gamearea.keys[e.keyCode] = true;
  }
})

document.getElementById("ResetMax").addEventListener("click", () => {
  resetScore();
});
document.getElementById("upSpeed").addEventListener("click", () => {
  addSpeed(1);
});
document.getElementById("downSpeed").addEventListener("click", () => {
  addSpeed(-1);
});

let redPiece, ok = 0, ok1 = 0, ok2 = 0;
let topgreen, bottomgreen;
const thing = document.getElementById("instruct");
const sty = "z-index:50;background-color:white;position:absolute;width:100%;height:80%;", html = thing.innerHTML;
// console.log(thing.style);
// console.log(thing.innerHTML);
setTimeout(startgame, 500);
setInterval(instruct, 1000);
let boolins = 0;


function Restart() {
  if (parMain.style.opacity === "0" && gamearea.keys[82] === false) { return; }
  parMain.style.opacity = 0;
  gamearea.frame = 0;
  gamearea.clear();
  obstacles = [];
  ok1 = 0;
  ok2 = 0;
  redPiece = new makePiece(30, 30, 0, gamearea.canvas.height / 1.5, "red");
}

function startgame() {
  redPiece = new makePiece(30, 30, 0, gamearea.canvas.height / 1.5, "red");
  gamearea.start();
}

function stopitems() {
  redPiece.speedx = 0;
  redPiece.speedy = 0;
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i][0].speedy = 0;
    obstacles[i][1].speedx = 0;
  }
}

document.getElementById("Gname").addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    event.preventDefault();
  }
});

function instruct() {
  if (parGname.name.value === "") {
    //console.log("hello");
    thing.innerHTML = html;
    thing.style = sty;
    if (ok1 === 0) { stopitems(); ok1 = 1; ok2 = 1; }
    return;
  }
  Pname = parGname.name.value;
  //console.log("bye");
  thing.innerHTML = "";
  thing.style = "";
}

let Fform = 0;

let gamearea = {
  canvas: document.getElementById("mycanvas"),
  start: function () {
    this.keys = [];
    for (let i = 0; i < 500; i++) { this.keys.push(false); }
    this.canvas.width = screen.width / 2.5;
    this.canvas.height = screen.height / 3;
    this.context = this.canvas.getContext("2d");
    this.frame = 0;
    this.interval = setInterval(updatePiece, 20);
    this.secinterval = setInterval(doObs, 100);
  },
  stop: function () {
    parMain.style.opacity = 0.5;
    if (gamearea.frame > Mxscore) { Mxscore = gamearea.frame; }
    refreshUI();
    frames = gamearea.frame;
    if (ok1 === 0) { data.push({ name: parGname.name.value, score: gamearea.frame }); }
    this.frame = 0;
    localStorage.setItem("mxscore", Mxscore);
    ok1 = 1;
    stopitems();
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function makeText(x, y) {
  this.x = x;
  this.y = y;
  this.width = "30px";
  this.height = "Consolas";
  this.points = 0;
  this.updates = function () {
    let ctx = gamearea.context;
    this.points = gamearea.frame;
    this.text = "Score: " + this.points;
    ctx.font = this.width + " " + this.height;
    ctx.fillStyle = "black";
    ctx.fillText(this.text, this.x, this.y);
  }
}

let randoooo = 0;

function addSpeed(add) {
  if (curSpeed + add < 1 || curSpeed + add > 100) { return; }
  curSpeed += add;
  refreshUI();
}

function makePiece(width, height, x, y, color) {
  this.width = width; this.height = height; this.x = x; this.y = y; this.color = color;
  this.speedx = 0;
  this.speedy = 0;

  let num = 1;
  this.update = function () {
    let ctx = gamearea.context;
    ctx.fillStyle = color;
    this.speedx = 0;
    this.speedy = 0;
    if (color !== "green" && ok1 === 0) {
      if (gamearea.keys && gamearea.keys[87]) { this.speedy = -1; }
      if (gamearea.keys && gamearea.keys[68]) { this.speedx = 1; }
      if (gamearea.keys && gamearea.keys[83]) { this.speedy = 1; }
      if (gamearea.keys && gamearea.keys[65]) { this.speedx = -2; }
    }
    else {
      if (ok1 === 0) { this.speedx = -1; }
    }
    let num = 1;
    if (this.speedx < 0) { num = -1; }
    if (this.speedx !== 0) { this.speedx += ((curSpeed - 1) * 0.3) * num; }
    num = 1;
    if (this.speedy < 0) { num = -1; }
    if (this.speedy !== 0) { this.speedy += ((curSpeed - 1) * 0.3) * num; }
    this.x += this.speedx;
    this.y += this.speedy;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (color !== "green" && (this.x < 0 || this.x + this.width > gamearea.canvas.width || this.y < 0 || this.y + this.height > gamearea.canvas.height)) {
      gamearea.stop();
    }
  }
  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

function doObs() {
  const n = obstacles.length;
  if (n != 0) { if (gamearea.canvas.width - obstacles[n - 1][2] <= 130) { return; } }
  let h1 = parseInt(Math.random() * 1000);
  h1 = h1 % 180 + 5;
  topgreen = new makePiece(20, h1, gamearea.canvas.width - 20, 0, "green");
  let num = parseInt(Math.random() * 1000);
  num = num % 70;
  if (num < 45) { num += 45; }
  let h2 = gamearea.canvas.height - h1 - num;
  bottomgreen = new makePiece(20, h2, gamearea.canvas.width - 20, gamearea.canvas.height - h2, "green");
  obstacles.push([topgreen, bottomgreen, gamearea.canvas.width]);
}

let myscore = new makeText(gamearea.canvas.width, 40);

function updatePiece() {
  if (ok1 === 0) { gamearea.frame += 1 * curSpeed; }
  gamearea.clear();
  myscore.updates();
  redPiece.update();
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i][0].update();
    obstacles[i][1].update();
    if (ok1 === 0) { obstacles[i][2] -= (1 + 0.3 * (curSpeed - 1)); }
    if (redPiece.crashWith(obstacles[i][0])) {
      gamearea.stop();
    }
    if (redPiece.crashWith(obstacles[i][1])) {
      gamearea.stop();
    }
  }
}
// window.onblur = function () {
//   // do some stuff after tab was changed e.g.
//   alert('You switched the tab');
// }
