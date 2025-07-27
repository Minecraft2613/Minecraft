        import { showCustomAlert } from './utils.js';

        const SERVER_STATUS_ELEM = document.getElementById('server-status');
        const PLAYER_COUNT_ELEM = document.getElementById('player-count');
        const SERVER_CONTROL_OPTIONS_ELEM = document.getElementById('server-control-options');
        const ONLINE_PLAYERS_LIST_ELEM = document.getElementById('online-players-list');

        export async function fetchServerStatus() {
            SERVER_STATUS_ELEM.textContent = 'Checking status...';
            PLAYER_COUNT_ELEM.textContent = '';
            SERVER_CONTROL_OPTIONS_ELEM.innerHTML = '';
            ONLINE_PLAYERS_LIST_ELEM.innerHTML = '<li>Loading player list...</li>';

            try {
                // This is a placeholder. In a real application, you would fetch this from a backend that can query the Minecraft server.
                const isOnline = Math.random() > 0.5; // Simulate online/offline status
                const playerCount = isOnline ? Math.floor(Math.random() * 20) : 0;
                const players = isOnline ? [
                    { name: 'Player1', platform: 'Java' },
                    { name: 'Player2', platform: 'Bedrock' },
                    { name: 'Player3', platform: 'Java' },
                ] : [];

                if (isOnline) {
                    SERVER_STATUS_ELEM.textContent = 'Online';
                    SERVER_STATUS_ELEM.className = 'status-online';
                    PLAYER_COUNT_ELEM.textContent = `${playerCount} / 20`;
                    renderPlayerList(players);
                    SERVER_CONTROL_OPTIONS_ELEM.innerHTML = `<button style="background-color: var(--button-red);" onclick="window.open('https://freemcserver.net/server/1524209', '_blank')">Stop Server</button>`;
                } else {
                    SERVER_STATUS_ELEM.textContent = 'Offline';
                    SERVER_STATUS_ELEM.className = 'status-offline';
                    PLAYER_COUNT_ELEM.textContent = '0 / 20';
                    ONLINE_PLAYERS_LIST_ELEM.innerHTML = '<li>Server is offline.</li>';
                    SERVER_CONTROL_OPTIONS_ELEM.innerHTML = `<button style="background-color: var(--button-primary);" onclick="window.open('https://freemcserver.net/server/1524209', '_blank')">Start Server</button>`;
                }

            } catch (error) {
                SERVER_STATUS_ELEM.textContent = 'Error';
                SERVER_STATUS_ELEM.className = 'status-offline';
                showCustomAlert('Error', 'Could not fetch server status.');
                console.error('Error fetching server status:', error);
            }
        }

        function renderPlayerList(players) {
            if (players.length === 0) {
                ONLINE_PLAYERS_LIST_ELEM.innerHTML = '<li>No players online.</li>';
                return;
            }

            ONLINE_PLAYERS_LIST_ELEM.innerHTML = players.map(player => `
                <li>
                    <span>${player.name}</span>
                    <span style="color: ${player.platform === 'Java' ? 'var(--accent-green)' : 'var(--accent-blue)'} ">${player.platform}</span>
                </li>
            `).join('');
        }
