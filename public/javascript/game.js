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
  sendToPlayer(playerIndex, msg) {
    this.players[playerIndex].emit("selection", msg);
  }

  onTurn(playerIndex, turn) {
    this.turns[playerIndex] = turn;
    this.sendToPlayer(playerIndex, `You selected ${turn}`);

    this.checkGameOver();
  }
  checkGameOver() {
    const turns = this.turns;

    if (turns[0] && turns[1]) {
      this.sendToPlayers("Game over" + turns.join(" : "));
      this.turns = [null, null];
      //this.sendToPlayers('Next Round!!!!');
    }
  }
}
module.exports = Game;
