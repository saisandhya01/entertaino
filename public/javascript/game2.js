const fetch = require("node-fetch");
class Game2 {
  constructor(p1, p2) {
    this.players = [p1, p2];
    this.turns = [null, null];
    this.sendToPlayers("Game Starts!");
    this.sendQuote();
    this.players.forEach((player, idx) => {
      player.on("turn", (turn) => {
        this.onTurn(idx, turn);
      });
    });
  }
  sendToPlayers(msg) {
    this.players.forEach((player) => {
      player.emit("message", msg);
    });
  }
  sendToPlayers2(msg) {
    this.players.forEach((player) => {
      player.emit("results", msg);
    });
  }
  sendToPlayer(playerIndex, msg) {
    this.players[playerIndex].emit("your-result", msg);
  }

  sendQuote() {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await fetch("http://api.quotable.io/random");
          const json = await response.json();
          this.players.forEach((player) => {
            player.emit("question", json.content);
          });
        } catch (error) {
          return reject(error);
        }
      })();
    });
  }
  onTurn(playerIndex, turn) {
    this.turns[playerIndex] = turn;
    this.sendToPlayer(playerIndex, `${turn}`);
    this.checkGameOver();
  }
  checkGameOver() {
    const turns = this.turns;
    if (turns[0] && turns[1]) {
      this.sendToPlayers2("Round over-" + turns.join(" : "));
      //console.log("game over", turns[0], turns[1]);
      this.getGameResult();
      this.turns = [null, null];
      this.sendToPlayers2("Next Round!");
    }
  }
  getGameResult() {
    if (this.turns[0] > this.turns[1]) {
      this.sendWinMessage(this.players[1], this.players[0]);
    } else if (this.turns[1] > this.turns[0]) {
      this.sendWinMessage(this.players[0], this.players[1]);
    } else {
      this.sendToPlayers2("Draw");
    }
  }
  sendWinMessage(winner, loser) {
    winner.emit("results", "You won!");
    loser.emit("results", "You lost.");
  }
}
module.exports = Game2;
