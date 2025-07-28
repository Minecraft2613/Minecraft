// --- Top 3 Most Taxed Players Logic ---
const taxedPlayersList = document.getElementById('taxed-players-list');
const topTaxedData = [...allPlayersData].sort((a, b) => b.taxPaid - a.taxPaid).slice(0, 3);

function renderTaxedPlayers() {
    taxedPlayersList.innerHTML = '';
    topTaxedData.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}. ${player.name}:</strong> <span>$${player.taxPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
        taxedPlayersList.appendChild(li);
    });
}
