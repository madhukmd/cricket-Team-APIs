const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAtserver = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server Runnign at http://localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAtserver();

//API 1

const convertList = (eachList) => {
  return {
    playerId: eachList.player_id,
    playerName: eachList.player_name,
    jerseyNumber: eachList.jersey_number,
    role: eachList.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `SELECT * FROM cricket_team`;
  const playersList = await db.all(getPlayersQuery);

  const formatPlayerList = playersList.map((eachList) => convertList(eachList));
  response.send(formatPlayerList);
});

//API 2

app.post("/players/", async (request, response) => {
  const palyerdatails = request.body;
  const { playerName, jerseyNumber, role } = palyerdatails;

  const addPlayerQuery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
        '${playerName}',
         ${jerseyNumber},
        '${role}',
      );`;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId}`;

  const player = await db.get(getPlayerQuery);
  console.log(player);
  const playerDT = [player];
  response.send(playerDT.map((list) => convertList(list)));
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const updatePlayerQuery = `UPDATE  cricket_team SET 
  player_name = "${playerName}",
  jersey_number = ${jerseyNumber},
  role = "${role}"
WHERE player_id=${playerId}`;

  const updatePlayer = await db.run(updatePlayerQuery);
  reponse.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const playerDeleteQuery = `DELETE FROM cricket_team WHERE player_id=${playerId}`;
  const deletePlayer = await db.run(playerDeleteQuery);
  response.send("Player Removed");
});
module.exports = app;
