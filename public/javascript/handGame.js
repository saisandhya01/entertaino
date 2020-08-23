let optionClassElement = document.getElementsByClassName("option");
let numberOfClicks = 0;
const finalColumn = document.querySelector("[data-final-column]");
let yourScore = document.getElementById("your-score");
let computerScore = document.getElementById("computer-score");
let resultMessage = document.getElementById("result-message");
let possibilities = [
  {
    name: "elephant",
    emoji: "🐘",
    beats: "man",
  },
  {
    name: "ant",
    emoji: "🐜",
    beats: "elephant",
  },
  {
    name: "man",
    emoji: "👲",
    beats: "ant",
  },
];
for (let i = 0; i < optionClassElement.length; i++) {
  let element = optionClassElement[i];
  element.addEventListener("mouseover", () => {
    element.style.fontSize = "50px";
  });
  element.addEventListener("mouseout", () => {
    element.style.fontSize = "35px";
  });
  element.addEventListener("click", (e) => {
    numberOfClicks++;
    let selectionName = element.id;
    const selectedDetails = possibilities.find(
      (option) => selectionName === option.name
    );
    makeSelections(selectedDetails);
    if (numberOfClicks > 15) {
      let score = yourScore.innerHTML;
      sendScoreToServer(score);
      displayWinner();
    }
  });
}
function makeSelections(selectedDetails) {
  const computerSelection = randomSelection();
  const isWinnerYou = isWinner(selectedDetails, computerSelection);
  const isWinnerComputer = isWinner(computerSelection, selectedDetails);
  addSelections(computerSelection, isWinnerComputer);
  addSelections(selectedDetails, isWinnerYou);
  if (isWinnerYou) {
    yourScore.innerHTML = Number(yourScore.innerHTML) + 1;
  }
  if (isWinnerComputer) {
    computerScore.innerHTML = Number(computerScore.innerHTML) + 1;
  }
}
function addSelections(selection, winner) {
  let div = document.createElement("div");
  div.innerHTML = selection.emoji;
  div.classList.add("result-selection");
  if (winner) div.classList.add("winner");
  finalColumn.after(div);
}
function isWinner(selection, opponentSelection) {
  if (selection.beats === opponentSelection.name) {
    return true;
  } else {
    return false;
  }
}
function randomSelection() {
  const randomIndex = Math.floor(Math.random() * possibilities.length);
  return possibilities[randomIndex];
}
function sendScoreToServer(score) {
  const scoreDetails = {
    name: "game2",
    score: score,
  };
  var xhr = new window.XMLHttpRequest();
  xhr.open("POST", "/score", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(scoreDetails));
}
function displayWinner() {
  document.body.style.opacity = "0.4";
  let span = document.getElementById("score");
  span.innerHTML = yourScore.innerHTML;
  setTimeout(() => {
    resultMessage.style.display = "block";
  }, 500);
}
