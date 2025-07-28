// --- All Players Logic ---
const allPlayersData = [
    { name: 'Ansh', status: 'Online', edition: 'Java', balance: 1673671.60, taxPaid: 171693.69 },
    { name: '.Atharva3044', status: 'Online', edition: 'Bedrock', balance: 879.97, taxPaid: 23780.87 }, // Exchanged balance
    { name: '.Atharva4617', status: 'Offline', edition: 'Bedrock', balance: 893572.56, taxPaid: 20683 }, // Exchanged balance
];

const allPlayersList = document.getElementById('all-players-list');
const allPlayersSearch = document.getElementById('all-players-search');

function renderAllPlayers(playersToRender) {
    allPlayersList.innerHTML = '';
    if (playersToRender.length === 0) {
        allPlayersList.innerHTML = '<li>No players found.</li>';
        return;
    }
    playersToRender.forEach(player => {
        const li = document.createElement('li');
        // Displaying only name, status, and edition as requested
        li.innerHTML = `<strong>${player.name}:</strong> <span>${player.status}, Edition: ${player.edition}</span>`;
        allPlayersList.appendChild(li);
    });
}

// Player search functionality
allPlayersSearch.addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const filteredPlayers = allPlayersData.filter(player =>
        player.name.toLowerCase().includes(filter)
    );
    renderAllPlayers(filteredPlayers);
});
