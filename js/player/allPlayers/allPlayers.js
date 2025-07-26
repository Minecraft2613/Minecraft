function renderAllPlayers(playersToRender) {
    const allPlayersList = document.getElementById('all-players-list');
    allPlayersList.innerHTML = '';
    if (playersToRender.length === 0) {
        allPlayersList.innerHTML = '<li>No players found.</li>';
        return;
    }
    playersToRender.forEach(player => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${player.name}:</strong> <span>${player.status}, Edition: ${player.edition}</span>`;
        allPlayersList.appendChild(li);
    });
}