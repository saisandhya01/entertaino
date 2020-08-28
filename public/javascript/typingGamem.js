var socket = io();
socket.emit("game4", "typingGame");
socket.on("message", writeConnectionResult);
function writeConnectionResult(text) {
  document.getElementById("connection-result").innerHTML = text;
}
socket.on("question", addQuote);
let quoteDisplay = document.getElementById("quoteDisplay");
let quoteInput = document.getElementById("quoteInput");
let timer = document.getElementById("timer");
function addQuote(text) {
  quoteDisplay.innerHTML = "";
  const quoteArray = text.split("");
  quoteArray.forEach((character) => {
    const span = document.createElement("span");
    span.innerHTML = character;
    quoteDisplay.appendChild(span);
  });
  setTimer();
}
quoteInput.addEventListener("input", () => {
  const arrayOfSpans = document.querySelectorAll("span");
  const arrayInput = quoteInput.value.split("");
  let correct = true;
  arrayOfSpans.forEach((characterSpan, index) => {
    const characterInput = arrayInput[index];
    if (characterInput == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterInput == characterSpan.innerHTML) {
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.add("correct");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });
  if (correct) {
    //changeTimeToScore(timer.innerHTML)
    clearTimer();
  }
});
let interval = null;
function changeSeconds() {
  let second = Number(timer.innerHTML);
  second += 1;
  timer.innerHTML = second;
}
function setTimer() {
  interval = window.setInterval(changeSeconds, 1000);
}
function clearTimer() {
  window.clearInterval(interval);
  inteval = null;
  socket.emit("turn", timer.innerHTML);
  timer.innerHTML = 0;
}
socket.on("your-result", yourResult);
let resultDiv = document.getElementById("game-results");
function yourResult(text) {
  let p = document.createElement("p");
  p.innerHTML = `Time taken is ${text} seconds`;
  resultDiv.appendChild(p);
}
socket.on("results", addResult);
function addResult(text) {
  let p = document.createElement("p");
  p.innerHTML = `${text}`;
  resultDiv.appendChild(p);
}
