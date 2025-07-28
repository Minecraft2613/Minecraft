// --- Top 3 Richest Players Logic ---
const richestPlayersList = document.getElementById('richest-players-list');
const topRichestData = [...allPlayersData].sort((a, b) => b.balance - a.balance).slice(0, 3);

function renderRichestPlayers() {
    richestPlayersList.innerHTML = '';
    topRichestData.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}. ${player.name}:</strong> <span>$${player.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
        richestPlayersList.appendChild(li);
    });
}
