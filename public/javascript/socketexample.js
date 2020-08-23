var socket = io();
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
addButtonListeners();
socket.on("selection", writeResult);
function writeResult(text) {
  let parent = document.getElementById("results");
  let p = document.createElement("p");
  p.innerHTML = text;
  parent.appendChild(p);
}
