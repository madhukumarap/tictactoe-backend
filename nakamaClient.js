const { Client } = require("@heroiclabs/nakama-js");

// Adjust host/port to your Nakama instance
const client = new Client("defaultkey", "http", "127.0.0.1", 7350);
module.exports = client;