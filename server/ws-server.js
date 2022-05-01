const WebSocketServer = require('ws');
 
const wss = new WebSocketServer.Server({ port: 8080 })

let connections = [];
let userCount = 0;

const getName = (ws, connections) => connections.filter(s => s.socket == ws)[0].name;
const sendToEverybody = (text, connections) => {
    console.log(text);
    connections.forEach(s => s.socket.send(text));
};
 
wss.on("connection", ws => {
    let newUser = `User ${++userCount}`;

    connections.push({
        name: newUser, 
        socket: ws
    });

    let connectionMsg = `${newUser} is connected`;

    sendToEverybody(connectionMsg, connections);
    
    ws.on("message", msg => {
        let textContent = msg.toString();
        let sender = getName(ws, connections);
        sendToEverybody(`${sender} says: ${textContent}`, connections);
    });
    
    ws.on("close", () => {
        let disconectedUser = getName(ws, connections);
        connections = connections.filter(s => s.socket !== ws);

        let disconectionMsg = `${disconectedUser} disconnected`;
        sendToEverybody(disconectionMsg, connections);
    });
    
    ws.onerror = function () {
        console.log("Some error occurred")
    }
});
console.log("The WebSocket server is running on port 8080");