import app from "./app.js"
import { startSocketServer } from "./socket.js";
const PORT = process.env.PORT
const SocketPort = process.env.SocketPort || 8080
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
startSocketServer(SocketPort);