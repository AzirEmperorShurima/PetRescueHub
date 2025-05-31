import app from "./app.js"
import { startSocketServer } from "./socket.js";
import { scheduleEventReminderEmails } from "./src/Jobs/AutoSendMailUpcomingEvent.js";
import { 
    // startMissionTimeoutJob,
     checkMissionTimeouts } from './src/Jobs/MissionTimeoutJob.js';
const PORT = process.env.PORT
const SocketPort = process.env.SOCKET_PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
startSocketServer(SocketPort);
// startMissionTimeoutJob();
checkMissionTimeouts()
scheduleEventReminderEmails()