// --- Players Section Navigation ---
const playerSubNavButtons = document.querySelectorAll('#players-content .player-sub-nav button');
const playerSubContents = document.querySelectorAll('#players-content .player-sub-content');

function showPlayerSubSection(sectionId) {
    playerSubContents.forEach(content => {
        content.classList.remove('active');
    });
    playerSubNavButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-player-sub-section="${sectionId.replace('-content', '')}"]`).classList.add('active');

    if (sectionId === 'all-players-content') {
        renderAllPlayers(allPlayersData); // Render all players on activation
    } else if (sectionId === 'top-richest-content') {
        renderRichestPlayers();
    } else if (sectionId === 'top-taxed-content') {
        renderTaxedPlayers();
    }
}

playerSubNavButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSection = button.dataset.playerSubSection + '-content';
        showPlayerSubSection(targetSection);
    });
});