const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { createGame, joinGame, makeMove, getLeaderboard, getPlayerStats, startTimer } = require("./gameManager");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

io.on("connection", socket => {
  console.log("✅ New client connected");

  socket.on("createGame", ({ player }) => {
    try {
      const gameId = createGame(player, 'classic');
      socket.join(gameId);
      socket.emit("gameCreated", { gameId, mode: 'classic' });
      console.log(`🎮 Classic game created by ${player} with ID: ${gameId}`);
    } catch (err) {
      socket.emit("errorMessage", err.message);
    }
  });

  socket.on("createTimedGame", ({ player }) => {
    try {
      const gameId = createGame(player, 'timed');
      socket.join(gameId);
      socket.emit("gameCreated", { gameId, mode: 'timed' });
      console.log(`⏰ Timed game created by ${player} with ID: ${gameId}`);
    } catch (err) {
      socket.emit("errorMessage", err.message);
    }
  });

  socket.on("joinGame", ({ gameId, player }) => {
    try {
      const game = joinGame(gameId, player);
      socket.join(gameId);
      
      // Start timer if it's a timed game and both players are present
      if (game.mode === 'timed' && game.players.length === 2) {
        console.log(`🎯 Starting initial timer for game ${gameId}`);
        startTimer(gameId);
      }
      
      io.to(gameId).emit("playerJoined", { player, gameId, mode: game.mode });
      console.log(`👥 ${player} joined game ${gameId}`);
    } catch (err) {
      socket.emit("errorMessage", err.message);
    }
  });

  socket.on("makeMove", ({ gameId, player, index }) => {
    try {
      const game = makeMove(gameId, player, index);
      io.to(gameId).emit("gameUpdate", game);
    } catch (err) {
      socket.emit("errorMessage", err.message);
    }
  });

  socket.on("getLeaderboard", () => {
    try {
      const leaderboard = getLeaderboard();
      socket.emit("leaderboardData", leaderboard);
    } catch (err) {
      socket.emit("errorMessage", err.message);
    }
  });

  socket.on("getPlayerStats", ({ player }) => {
    try {
      const stats = getPlayerStats(player);
      socket.emit("playerStats", stats);
    } catch (err) {
      socket.emit("errorMessage", err.message);
    }
  });

  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

server.listen(4000, () => console.log("🚀 Server running on port 4000"));