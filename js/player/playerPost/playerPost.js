function renderPlayerPost() {
    const playerPostContent = document.getElementById('player-post-content');
    playerPostContent.innerHTML = `
        <div class="player-post-area">
            <p style="color: #ccc;">No new player posts yet. Check back later!</p>
            <p style="font-size: 0.9em; margin-top: 15px; color: #999;">(Feature for players to submit announcements coming soon!)</p>
        </div>
    `;
}