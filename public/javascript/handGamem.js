var socket = io();
socket.emit("game3", "handGame");
socket.on("message", writeEvent);
function writeEvent(text) {
  let parent = document.getElementById("connection-message");
  parent.innerHTML = text;
}
const addButtonListeners = () => {
  ["elephant", "ant", "man"].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener("click", () => {
      socket.emit("turn", id);
    });
  });
};
let score = 0;
const hashMap = new Map([
  ["elephant", "🐘"],
  ["ant", "🐜"],
  ["man", "👲"],
]);

addButtonListeners();
socket.on("selection", findEmoji);
socket.on("result", writeResult);
socket.on("win", addScore);
function writeResult(text) {
  let parent = document.getElementById("results");
  let p = document.createElement("p");
  p.innerHTML = text;
  parent.appendChild(p);
}
function findEmoji(text) {
  const emoji = hashMap.get(text);
  writeResult(emoji);
}
function addScore(text) {
  score++;
  document.getElementById("score").innerHTML = score;
  sendScoreToServer(score);
  writeResult(text);
}
function sendScoreToServer(score) {
  const scoreDetails = {
    name: "game3",
    score: score,
  };
  var xhr = new window.XMLHttpRequest();
  xhr.open("POST", "/score", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(scoreDetails));
}
