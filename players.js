        const playersData = [
            { name: 'Player1', balance: 10000, tax: 500, platform: 'Java' },
            { name: 'Player2', balance: 5000, tax: 250, platform: 'Bedrock' },
            { name: 'Player3', balance: 12000, tax: 600, platform: 'Java' },
            { name: 'Player4', balance: 8000, tax: 400, platform: 'Java' },
            { name: 'Player5', balance: 20000, tax: 1000, platform: 'Bedrock' },
            { name: 'Player6', balance: 15000, tax: 750, platform: 'Java' },
        ];

        const RICHEST_PLAYERS_LIST_ELEM = document.getElementById('richest-players-list');
        const ALL_PLAYERS_LIST_ELEM = document.getElementById('all-players-list');
        const TAXED_PLAYERS_LIST_ELEM = document.getElementById('taxed-players-list');
        const ALL_PLAYERS_SEARCH_INPUT = document.getElementById('all-players-search');

        function renderRichestPlayers() {
            const richestPlayers = [...playersData].sort((a, b) => b.balance - a.balance).slice(0, 3);
            RICHEST_PLAYERS_LIST_ELEM.innerHTML = richestPlayers.map(player => `
                <li>
                    <strong>${player.name}</strong>
                    <span>Balance: $${player.balance.toLocaleString()}</span>
                </li>
            `).join('');
        }

        function renderAllPlayers(players) {
            ALL_PLAYERS_LIST_ELEM.innerHTML = players.map(player => `
                <li>
                    <strong>${player.name}</strong>
                    <span>${player.platform}</span>
                </li>
            `).join('');
        }

        function renderTaxedPlayers() {
            const taxedPlayers = [...playersData].sort((a, b) => b.tax - a.tax).slice(0, 3);
            TAXED_PLAYERS_LIST_ELEM.innerHTML = taxedPlayers.map(player => `
                <li>
                    <strong>${player.name}</strong>
                    <span>Tax Paid: $${player.tax.toLocaleString()}</span>
                </li>
            `).join('');
        }

        ALL_PLAYERS_SEARCH_INPUT.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPlayers = playersData.filter(player => player.name.toLowerCase().includes(searchTerm));
            renderAllPlayers(filteredPlayers);
        });

        document.querySelectorAll('#players-content .player-sub-nav button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('#players-content .player-sub-nav button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                document.querySelectorAll('#players-content .player-sub-content').forEach(content => content.classList.remove('active'));

                const section = button.dataset.playerSubSection;
                document.getElementById(`${section}-content`).classList.add('active');
            });
        });

        export function initPlayers() {
            renderRichestPlayers();
            renderAllPlayers(playersData);
            renderTaxedPlayers();
        }
