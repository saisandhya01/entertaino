const express = require("express");
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require("../config/auth");
const Controllers = require("../controllers/controller.js");

router.get("/", checkNotAuthenticated, Controllers.welcome);

router.get("/register", checkNotAuthenticated, Controllers.register);

router.post("/register", checkNotAuthenticated, Controllers.user_register);

router.get("/login", checkNotAuthenticated, Controllers.login);

router.post("/login", checkNotAuthenticated, Controllers.user_login);

router.get("/home", checkAuthenticated, Controllers.user_home);

router.post("/logout", checkAuthenticated, Controllers.logOut);

router.get("/diary", checkAuthenticated, Controllers.diary);

router.get("/planner", checkAuthenticated, Controllers.planner);

router.get("/choose/game", checkAuthenticated, Controllers.choose_game);

router.get("/game1", checkAuthenticated, Controllers.game1);

router.get("/game2", checkAuthenticated, Controllers.game2);

router.get("/game3", checkAuthenticated, Controllers.game3);

router.get("/scoreboard", checkAuthenticated, Controllers.score_board);

router.get("/score/table", checkAuthenticated, Controllers.score_table);

router.post("/score", checkAuthenticated, Controllers.score);

router.get("/name", checkAuthenticated, Controllers.name);

router.get("/weather", checkAuthenticated, Controllers.weather);

router.get("/image-upload", checkAuthenticated, Controllers.image_upload);

router.post("/upload", checkAuthenticated, Controllers.upload);

router.post("/note", checkAuthenticated, Controllers.update_note);

router.delete("/note", checkAuthenticated, Controllers.delete_note);

router.get("/note/:date", checkAuthenticated, Controllers.get_note);

router.post("/task", checkAuthenticated, Controllers.update_task);

router.delete("/task", checkAuthenticated, Controllers.delete_task);

router.get("/task/:date", checkAuthenticated, Controllers.get_task);
router.get("/socket", checkNotAuthenticated, (req, res) => {
  res.render("socketexample");
});

module.exports = router;
