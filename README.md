# Tic-Tac-Toe Multiplayer Game

A real-time multiplayer Tic-Tac-Toe game with server-authoritative logic, matchmaking system, leaderboards, and timed game modes.

## 🎮 Features

### Core Features
- **Real-time Multiplayer**: Play with friends in real-time using WebSockets
- **Server-Authoritative Logic**: All game logic validated on server to prevent cheating
- **Matchmaking System**: Create games and join with game IDs
- **Responsive Design**: Mobile-optimized UI that works on all devices
- **Live Game Updates**: Real-time board updates and player status

### Advanced Features
- **Game Modes**: Classic and Timed modes (30 seconds per move)
- **Leaderboard System**: Global rankings with win rates and streaks
- **Player Statistics**: Track wins, losses, streaks, and performance metrics
- **Game Reset**: Play again with the same players after game ends
- **Concurrent Games**: Support for multiple simultaneous game sessions

## 🏗️ Architecture

### System Design
```
Frontend (React) ↔ WebSocket ↔ Backend (Node.js/Express) ↔ In-Memory Storage
     ↑                               ↑
  Client UI                      Game Logic
                                  Matchmaking
                                  Leaderboards
                                  Real-time Updates
```

### Technology Stack
- **Frontend**: React, Socket.io Client, Inline CSS
- **Backend**: Node.js, Express, Socket.io
- **Real-time Communication**: WebSockets via Socket.io
- **Storage**: In-memory JavaScript objects (can be extended to database)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   Create a `.env` file:
   ```env
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure backend URL**
   Update the socket connection in `App.js`:
   ```javascript
   // For local development
   const socket = io("http://localhost:4000");
   
   // For production
   const socket = io("https://your-backend-url.com");
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   Application will open on `http://localhost:3000`

## 🎯 How to Play

### Creating a Game
1. Click "Create Classic Game" or "Create Timed Game"
2. Enter your player name
3. Share the Game ID with your friend
4. Wait for opponent to join

### Joining a Game
1. Click "Join Existing Game"
2. Enter the Game ID provided by the game creator
3. Enter your player name
4. Game starts automatically when both players are connected

### Game Modes
- **Classic**: No time limits, traditional Tic-Tac-Toe
- **Timed**: 30-second time limit per move, automatic forfeit on timeout

## 🔧 API Documentation

### WebSocket Events

#### Client to Server Events

| Event | Data | Description |
|-------|------|-------------|
| `createGame` | `{ player: string }` | Create a new classic game |
| `createTimedGame` | `{ player: string }` | Create a new timed game |
| `joinGame` | `{ gameId: string, player: string }` | Join existing game |
| `makeMove` | `{ gameId: string, player: string, index: number }` | Make a move (0-8) |
| `resetGame` | `{ gameId: string }` | Reset current game |
| `getLeaderboard` | `{}` | Request leaderboard data |
| `getPlayerStats` | `{ player: string }` | Request player statistics |

#### Server to Client Events

| Event | Data | Description |
|-------|------|-------------|
| `gameCreated` | `{ gameId: string, mode: string }` | Game created successfully |
| `playerJoined` | `{ player: string, gameId: string, mode: string }` | Player joined the game |
| `gameUpdate` | `GameState` | Game state update |
| `gameReset` | `GameState` | Game reset confirmation |
| `leaderboardData` | `LeaderboardEntry[]` | Leaderboard data |
| `playerStats` | `PlayerStats` | Player statistics |
| `errorMessage` | `{ message: string }` | Error notification |

### Data Structures

#### GameState
```javascript
{
  board: string[],           // Array of 9 cells: null, "X", or "O"
  turn: string,             // Current player: "X" or "O"
  players: string[],        // Player names [player1, player2]
  winner: string,           // null, "X", "O", or "Draw"
  mode: string,             // "classic" or "timed"
  timeLimit: number,        // Time limit in ms (timed mode only)
  timer: NodeJS.Timeout     // Timer reference
}
```

#### PlayerStats
```javascript
{
  wins: number,
  losses: number,
  streak: number,
  maxStreak: number,
  total: number,
  winRate: number
}
```

#### LeaderboardEntry
```javascript
{
  player: string,
  wins: number,
  losses: number,
  streak: number,
  maxStreak: number,
  total: number,
  winRate: number
}
```

## 🏗️ Backend Architecture

### Core Modules

#### Game Manager (`gameManager.js`)
- Manages all active games
- Handles game logic and validation
- Tracks player statistics
- Implements timer logic for timed games

#### Server (`server.js`)
- WebSocket server setup and event handling
- Client connection management
- Real-time communication bridge

### Key Design Decisions

1. **Server-Authoritative Architecture**
   - All game logic runs on server
   - Client only sends intent, server validates and applies
   - Prevents cheating and ensures fair play

2. **In-Memory Storage**
   - Simple key-value store for active games
   - Fast read/write operations
   - Can be extended to database persistence

3. **Room-Based Communication**
   - Each game is a separate Socket.io room
   - Efficient broadcasting to relevant players only
   - Isolated game sessions

4. **Stateless Game Logic**
   - Pure functions for game operations
   - Easy testing and maintenance
   - Predictable state transitions

## 🚀 Deployment

### Backend Deployment (Render)

1. **Prepare for deployment**
   ```bash
   # Ensure package.json has start script
   "scripts": {
     "start": "node server.js"
   }
   ```

2. **Environment variables** (if using Render)
   - `PORT`: 10000 (Render default)
   - `NODE_ENV`: production

3. **Deploy to Render**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables if needed

### Frontend Deployment (Netlify/Vercel)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Update backend URL**
   ```javascript
   const socket = io("https://your-backend-url.onrender.com");
   ```

3. **Deploy to Netlify**
   - Drag and drop `build` folder to Netlify
   - Or connect GitHub repository for auto-deploys

### Environment Configuration

#### Backend Environment Variables
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=https://your-frontend-url.netlify.app
```

#### Frontend Configuration
Update `App.js` socket connection:
```javascript
// Development
const socket = io("http://localhost:4000");

// Production
const socket = io("https://tictactoe-backend-6uv3.onrender.com");
```

## 🧪 Testing

### Manual Testing Checklist

#### Game Flow Testing
- [ ] Create classic game
- [ ] Join existing game
- [ ] Make valid moves
- [ ] Win condition detection
- [ ] Draw condition detection
- [ ] Play again functionality

#### Timed Mode Testing
- [ ] Create timed game
- [ ] Timeout handling
- [ ] Automatic forfeit on timeout
- [ ] Timer reset on valid move

#### Multiplayer Testing
- [ ] Two players can connect
- [ ] Real-time updates work
- [ ] Turn-based gameplay
- [ ] Disconnection handling

#### Feature Testing
- [ ] Leaderboard displays correctly
- [ ] Player statistics update
- [ ] Responsive design on mobile
- [ ] Error handling

### Testing Commands

#### Backend Testing
```bash
# Start test server
cd backend
npm start

# Test with multiple clients
# Open multiple browser tabs to simulate multiple players
```

#### Frontend Testing
```bash
# Start development server
cd frontend
npm start

# Test on different devices
# Use browser dev tools to simulate mobile devices
```

### Network Testing
1. **Test real-time updates**: Open two browser windows/tabs
2. **Test mobile responsiveness**: Use browser dev tools or actual mobile device
3. **Test slow connections**: Use browser network throttling
4. **Test disconnections**: Manually disconnect and reconnect

## 🔧 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check backend server is running
   - Verify CORS configuration
   - Check firewall/port settings

2. **Game Not Starting**
   - Verify both players joined
   - Check game ID is correct
   - Refresh and try again

3. **Moves Not Working**
   - Check it's your turn
   - Verify cell is not already occupied
   - Check console for error messages

4. **Real-time Updates Not Working**
   - Check WebSocket connection
   - Verify both players are in same game room
   - Check network connectivity

### Debug Mode

Add debug logging by modifying the socket connection:

```javascript
const socket = io("http://localhost:4000", {
  transports: ['websocket']
});

// Debug connection events
socket.on("connect", () => console.log("✅ Connected"));
socket.on("disconnect", () => console.log("❌ Disconnected"));
socket.on("connect_error", (err) => console.log("❌ Connection error:", err));
```

## 📁 Project Structure

```
tictactoe-multiplayer/
├── backend/
│   ├── gameManager.js     # Game logic and state management
│   ├── server.js          # Express and Socket.io server
│   ├── package.json       # Dependencies and scripts
│   └── README.md          # Backend documentation
├── frontend/
│   ├── src/
│   │   └── App.js         # Main React component
│   ├── public/
│   ├── package.json       # Dependencies and scripts
│   └── README.md          # Frontend documentation
└── README.md              # This file
```

## 🛠️ Development

### Adding New Features

1. **Backend Changes**
   - Add new game manager functions
   - Implement new socket event handlers
   - Update data structures if needed

2. **Frontend Changes**
   - Add new UI components
   - Implement new socket event listeners
   - Update state management

3. **Testing**
   - Test both backend and frontend changes
   - Verify real-time functionality
   - Check error handling

