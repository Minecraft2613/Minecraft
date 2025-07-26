function renderRichestPlayers() {
    const richestPlayersList = document.getElementById('richest-players-list');
    richestPlayersList.innerHTML = '';
    topRichestData.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}. ${player.name}:</strong> <span>$${player.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
        richestPlayersList.appendChild(li);
    });
}