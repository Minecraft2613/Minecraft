// --- Server Status Script (Directly provided logic) ---
const serverIP = "mc1524209.fmcs.cloud"; // Your FreeMcServer IP

async function fetchServerStatus() {
    const statusDiv = document.getElementById("server-status");
    const playersDiv = document.getElementById("player-count");
    const onlinePlayersList = document.getElementById("online-players-list");
    const serverControlOptions = document.getElementById('server-control-options');
    serverControlOptions.innerHTML = ''; // Clear previous buttons

    // Update static IP/Port displays (always the same)
    document.getElementById("server-ip").textContent = serverIP;
    document.getElementById("server-port").textContent = "38762"; // Hardcoded as requested

    try {
        const res = await fetch(`https://api.mcsrvstat.us/2/${serverIP}`);
        const data = await res.json();

        if (!data || typeof data.online === "undefined") {
            statusDiv.innerHTML = "⚠️ Error checking server status.";
            statusDiv.className = "status-offline";
            playersDiv.innerHTML = "";
            onlinePlayersList.innerHTML = '<li>Error: Could not retrieve server status.</li>';
            serverControlOptions.innerHTML = `<a href="https://freemcserver.net/server/1524209" target="_blank"><button style="background-color: var(--button-primary);"><i class="fas fa-play"></i> Start Server</button></a>`;
            return;
        }

        if (!data.online) {
            statusDiv.innerHTML = "🔴 Offline";
            statusDiv.className = "status-offline";
            playersDiv.innerHTML = "";
            onlinePlayersList.innerHTML = '<li>Server is offline. Invalid player names (server does not exist to provide names).</li>';
            serverControlOptions.innerHTML = `<a href="https://freemcserver.net/server/1524209" target="_blank"><button style="background-color: var(--button-primary);"><i class="fas fa-play"></i> Start Server</button></a>`;
        } else {
            statusDiv.innerHTML = "🟢 Online";
            statusDiv.className = "status-online";
            playersDiv.innerHTML = `👥 ${data.players.online}/${data.players.max} Players`;
            serverControlOptions.innerHTML = `<button style="background-color: var(--button-red);" disabled><i class="fas fa-stop"></i> Server Running</button>`;

            // Display online players
            let playersListHtml = '';
            if (data.players && data.players.list && data.players.list.length > 0) {
                playersListHtml = data.players.list.map(p => `<li><span>${p}</span></li>`).join('');
            } else {
                playersListHtml = '<li>No players currently online.</li>';
            }
            onlinePlayersList.innerHTML = playersListHtml;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        statusDiv.innerHTML = "⚠️ Network Error: Cannot reach API.";
        statusDiv.className = "status-offline";
        playersDiv.innerHTML = "";
        onlinePlayersList.innerHTML = '<li>Network error. Please check your connection.</li>';
        serverControlOptions.innerHTML = `<a href="https://freemcserver.net/server/1524209" target="_blank"><button style="background-color: var(--button-primary);"><i class="fas fa-play"></i> Start Server</button></a>`;
    }
}

fetchServerStatus(); // Initial call
setInterval(fetchServerStatus, 5000); // Repeat every 5 seconds
