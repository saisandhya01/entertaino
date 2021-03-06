class Game {
  constructor(p1, p2) {
    this.players = [p1, p2];
    this.turns = [null, null];

    this.sendToPlayers("Game Starts!");

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
      player.emit("result", msg);
    });
  }

  sendToPlayer(playerIndex, msg) {
    this.players[playerIndex].emit("selection", msg);
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
      this.getGameResult();
      this.turns = [null, null];
      this.sendToPlayers2("Next Round!");
    }
  }
  getGameResult() {
    const p0 = this.decodeTurn(this.turns[0]);
    const p1 = this.decodeTurn(this.turns[1]);

    const distance = (p1 - p0 + 3) % 3;

    switch (distance) {
      case 0:
        this.sendToPlayers("Draw!");
        break;

      case 1:
        this.sendWinMessage(this.players[0], this.players[1]);
        break;

      case 2:
        this.sendWinMessage(this.players[1], this.players[0]);
        break;
    }
  }
  sendWinMessage(winner, loser) {
    winner.emit("win", "You won!");
    loser.emit("result", "You lost.");
  }

  decodeTurn(turn) {
    switch (turn) {
      case "ant":
        return 0;
      case "elephant":
        return 1;
      case "man":
        return 2;
      default:
        throw new Error(`Something went wrong: ${turn}`);
    }
  }
}
module.exports = Game;
