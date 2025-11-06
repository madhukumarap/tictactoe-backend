const games = {};
const playerStats = {}; // Simple in-memory storage

function createGame(player1, gameMode = 'classic') {
  const gameId = Date.now().toString();
  games[gameId] = {
    board: Array(9).fill(null),
    turn: "X",
    players: [player1],
    winner: null,
    mode: gameMode,
    lastMoveTime: Date.now(),
    timeLimit: gameMode === 'timed' ? 30000 : null, // 30 seconds
    timer: null,
    isProcessing: false // Add flag to prevent recursion
  };

  // Initialize player stats
  if (!playerStats[player1]) {
    playerStats[player1] = { wins: 0, losses: 0, streak: 0, maxStreak: 0 };
  }

  return gameId;
}

function joinGame(gameId, player2) {
  if (!games[gameId]) throw new Error("Game not found");
  if (games[gameId].players.length >= 2) throw new Error("Game already full");
  
  games[gameId].players.push(player2);
  
  // Initialize player2 stats
  if (!playerStats[player2]) {
    playerStats[player2] = { wins: 0, losses: 0, streak: 0, maxStreak: 0 };
  }
  
  return games[gameId];
}

function makeMove(gameId, player, index) {
  const game = games[gameId];
  if (!game) throw new Error("Game not found");
  if (game.winner) throw new Error("Game is over");

  const playerIndex = game.players.indexOf(player);
  if (playerIndex === -1) throw new Error("Player not in this game");
  const expectedPlayer = game.turn === "X" ? 0 : 1;
  if (playerIndex !== expectedPlayer) throw new Error("Not your turn");

  if (game.board[index] !== null) throw new Error("Cell occupied");

  // Clear existing timer for timed mode
  if (game.mode === 'timed' && game.timer) {
    clearTimeout(game.timer);
    game.timer = null;
  }

  game.board[index] = game.turn;
  game.winner = checkWinner(game.board);
  
  if (!game.winner) {
    game.turn = game.turn === "X" ? "O" : "X";
    
    // Start new timer for next player in timed mode
    if (game.mode === 'timed' && !game.winner) {
      startTimer(gameId);
    }
  } else {
    // Update stats when game ends
    if (game.winner !== "Draw") {
      updateStats(game.players[0], game.players[1], game.winner);
    }
    // Clear timer when game ends
    if (game.timer) {
      clearTimeout(game.timer);
      game.timer = null;
    }
  }

  return game;
}

function startTimer(gameId) {
  const game = games[gameId];
  if (!game || game.winner || game.mode !== 'timed') return;

  // Clear any existing timer
  if (game.timer) {
    clearTimeout(game.timer);
  }

  game.timer = setTimeout(() => {
    if (!game.winner && !game.isProcessing) {
      game.isProcessing = true;
      handleTimeout(gameId);
      game.isProcessing = false;
    }
  }, game.timeLimit);
}

function handleTimeout(gameId) {
  const game = games[gameId];
  if (!game || game.winner) return;

  console.log(`⏰ Timeout in game ${gameId} for player ${game.turn}`);
  
  const currentPlayerIndex = game.turn === "X" ? 0 : 1;
  const timeoutPlayer = game.players[currentPlayerIndex];
  
  game.winner = game.turn === "X" ? "O" : "X";
  
  // Update stats
  updateStats(game.players[0], game.players[1], game.winner);
  
  // Clear the timer
  if (game.timer) {
    clearTimeout(game.timer);
    game.timer = null;
  }
  
  return game;
}

function updateStats(player1, player2, winner) {
  if (winner && winner !== "Draw") {
    const winnerName = winner === "X" ? player1 : player2;
    const loserName = winner === "X" ? player2 : player1;
    
    // Initialize if not exists
    if (!playerStats[winnerName]) playerStats[winnerName] = { wins: 0, losses: 0, streak: 0, maxStreak: 0 };
    if (!playerStats[loserName]) playerStats[loserName] = { wins: 0, losses: 0, streak: 0, maxStreak: 0 };
    
    playerStats[winnerName].wins++;
    playerStats[winnerName].streak++;
    playerStats[winnerName].maxStreak = Math.max(
      playerStats[winnerName].maxStreak, 
      playerStats[winnerName].streak
    );
    
    playerStats[loserName].losses++;
    playerStats[loserName].streak = 0;
  }
}

function checkWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : "Draw";
}

function getLeaderboard() {
  return Object.entries(playerStats)
    .map(([player, stats]) => ({
      player,
      ...stats,
      total: stats.wins + stats.losses,
      winRate: ((stats.wins / (stats.wins + stats.losses)) * 100) || 0
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 10);
}

function getPlayerStats(player) {
  if (!playerStats[player]) {
    playerStats[player] = { wins: 0, losses: 0, streak: 0, maxStreak: 0 };
  }
  const stats = playerStats[player];
  return {
    ...stats,
    total: stats.wins + stats.losses,
    winRate: ((stats.wins / (stats.wins + stats.losses)) * 100) || 0
  };
}
// Add this to your gameManager.js
// ADD THIS FUNCTION - Reset Game
function resetGame(gameId) {
  const game = games[gameId];
  if (!game) throw new Error("Game not found");
  
  console.log(`🔄 Resetting game ${gameId}`);
  
  // Reset game state but keep players and mode
  game.board = Array(9).fill(null);
  game.turn = "X";
  game.winner = null;
  
  // Clear any existing timer
  if (game.timer) {
    clearTimeout(game.timer);
    game.timer = null;
  }
  
  // Start new timer for timed games
  if (game.mode === 'timed') {
    startTimer(gameId);
  }
  
  return game;
}


// FIXED: Export all necessary functions including startTimer
module.exports = { 
  createGame, 
  joinGame, 
  makeMove, 
  games, 
  getLeaderboard,
  getPlayerStats,
  playerStats,
  startTimer, // Added this export
  resetGame
};