async function fetchPlayersData() {
            const allPlayersResponse = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/allPlayer.json`, {
                headers: { 'X-Auth-Token': WORKER_API_KEY }
            });
            const allPlayers = allPlayersResponse.ok ? await allPlayersResponse.json() : [];

            const topRichestResponse = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/topThreeRichest.json`, {
                headers: { 'X-Auth-Token': WORKER_API_KEY }
            });
            const topRichest = topRichestResponse.ok ? await topRichestResponse.json() : [];

            const topTaxedResponse = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/topThreeMostTax.json`, {
                headers: { 'X-Auth-Token': WORKER_API_KEY }
            });
            const topTaxed = topTaxedResponse.ok ? await topTaxedResponse.json() : [];

            return { allPlayers, topRichest, topTaxed };
        }

        const playerSubContents = document.querySelectorAll('#players-content .player-sub-content');
        const allPlayersList = document.getElementById('all-players-list');
        const allPlayersSearch = document.getElementById('all-players-search');
        const richestPlayersList = document.getElementById('richest-players-list');
        const taxedPlayersList = document.getElementById('taxed-players-list');

        async function showPlayerSubSection(sectionId) {
            playerSubContents.forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('#players-content .player-sub-nav button').forEach(button => {
                button.classList.remove('active');
            });

            document.getElementById(sectionId).classList.add('active');
            document.querySelector(`[data-player-sub-section="${sectionId.replace('-content', '')}"]`).classList.add('active');

            const { allPlayers, topRichest, topTaxed } = await fetchPlayersData();

            if (sectionId === 'all-players-content') {
                renderAllPlayers(allPlayers);
            } else if (sectionId === 'top-richest-content') {
                renderRichestPlayers(topRichest);
            } else if (sectionId === 'top-taxed-content') {
                renderTaxedPlayers(topTaxed);
            }
        }

        function renderAllPlayers(playersToRender) {
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

        function renderRichestPlayers(playersToRender) {
            richestPlayersList.innerHTML = '';
            playersToRender.forEach((player, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${index + 1}. ${player.name}:</strong> <span>$${player.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
                richestPlayersList.appendChild(li);
            });
        }

        function renderTaxedPlayers(playersToRender) {
            taxedPlayersList.innerHTML = '';
            playersToRender.forEach((player, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${index + 1}. ${player.name}:</strong> <span>$${player.taxPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`;
                taxedPlayersList.appendChild(li);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('#players-content .player-sub-nav button').forEach(button => {
                button.addEventListener('click', () => {
                    const targetSection = button.dataset.playerSubSection + '-content';
                    showPlayerSubSection(targetSection);
                });
            });

            allPlayersSearch.addEventListener('input', async function() {
                const filter = this.value.toLowerCase();
                const { allPlayers } = await fetchPlayersData();
                const filteredPlayers = allPlayers.filter(player =>
                    player.name.toLowerCase().includes(filter)
                );
                renderAllPlayers(filteredPlayers);
            });

            showPlayerSubSection('top-richest-content');
        });