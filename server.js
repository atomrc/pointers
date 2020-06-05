const WebSocketServer = require("websocket").server;
const http = require("http");
const uuid = require("uuid");

const server = http.createServer((req, res) => {
  res.end();
});
server.listen(8080, () => console.log("server is listening"));

const positions = {};
const clients = [];

function broadcast(type, message) {
  clients.forEach((client) => client.send(buildMessage(type, message)));
}

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: true, //FIXEME
});

wsServer.on("connect", (connection) => {
  clients.push(connection);
  const clientId = uuid.v4();

  // send uuid to the client
  connection.send(buildMessage("client-id", clientId));

  connection.on("close", () => {
    clients.splice(clients.indexOf(connection), 1);
    delete positions[clientId];
  });

  connection.on("message", (event) => {
    const position = JSON.parse(event.utf8Data);
    positions[clientId] = position;
  });
});

function buildMessage(type, data) {
  return JSON.stringify({ type, data });
}

setInterval(() => {
  broadcast("clients-update", positions);
}, 1000);
