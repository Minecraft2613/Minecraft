        const pluginsData = [
            { name: 'EssentialsX', description: 'The essential plugin for any server, providing basic commands like /home, /spawn, and /warp.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'LuckPerms', description: 'A flexible permissions plugin that allows you to control what players can do on your server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'WorldEdit', description: 'An in-game map editor that allows you to modify thousands of blocks at once.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'GriefPrevention', description: 'Protect your server from griefers with land claiming and other tools.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'Vault', description: 'A dependency for many other plugins, providing an API for economy, permissions, and chat.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'PlaceholderAPI', description: 'A plugin that allows you to use placeholders in other plugins to display dynamic information.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'ViaVersion', description: 'Allows players on newer versions of Minecraft to join your server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'GeyserMC', description: 'Allows players on Bedrock Edition to join your Java Edition server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'SkinRestorer', description: 'Restores skins for offline mode servers.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'Citizens', description: 'Create NPCs (Non-Player Characters) on your server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'Shopkeepers', description: 'Create villager shopkeepers to trade items with players.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'CrazyCrates', description: 'Add crates to your server that can be opened with keys to get rewards.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'AuctionHouse', description: 'A plugin that allows players to auction their items to other players.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'Jobs Reborn', description: 'A plugin that allows players to get a job and earn money.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'AdvancedEnchantments', description: 'Adds custom enchantments to your server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'CMI', description: 'A comprehensive server management plugin with a huge amount of features.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'CoreProtect', description: 'Log all block changes and player actions to protect your server from griefers.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'DiscordSRV', description: 'Link your Minecraft server chat to a Discord channel.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'Dynmap', description: 'A Google Maps-like map for your Minecraft server that can be viewed in a browser.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'FastAsyncWorldEdit', description: 'A high-performance version of WorldEdit for large servers.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'HolographicDisplays', description: 'Create floating text displays on your server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'ImageOnMap', description: 'Display images on maps in your server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'LiteBans', description: 'A powerful and flexible banning plugin.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'Multiverse-Core', description: 'Create and manage multiple worlds on your server.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'ProtocolLib', description: 'A library that allows plugins to modify Minecraft's protocol.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'SuperVanish', description: 'A plugin that allows staff to become invisible to other players.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'TAB', description: 'A powerful and flexible tablist plugin.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'TradeSystem', description: 'A plugin that allows players to safely trade items with each other.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'UltimateTimber', description: 'A plugin that makes trees fall down when you break the bottom block.', links: [{ text: 'Docs', url: '#' }], video: '' },
            { name: 'WorldGuard', description: 'Protect your server's regions with flags and other tools.', links: [{ text: 'Docs', url: '#' }], video: '' },
        ];

        const PLUGIN_LIST_ELEM = document.getElementById('plugin-list');
        const PLUGIN_SEARCH_INPUT = document.getElementById('plugin-search');

        export function renderPlugins(plugins) {
            PLUGIN_LIST_ELEM.innerHTML = plugins.map(plugin => `
                <li class="${plugin.nonWorking ? 'non-working-plugin' : ''}">
                    <h3>${plugin.name}</h3>
                    <p class="description">${plugin.description}</p>
                    ${plugin.problem ? `<p class="problem-message">${plugin.problem}</p>` : ''}
                    <div class="plugin-links">
                        ${plugin.links.map(link => `<a href="${link.url}" target="_blank" class="plugin-link-btn">${link.text}</a>`).join('')}
                    </div>
                    ${plugin.video ? `
                        <div class="plugin-video">
                            <iframe src="${plugin.video}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    ` : ''}
                </li>
            `).join('');
        }

        PLUGIN_SEARCH_INPUT.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPlugins = pluginsData.filter(plugin => plugin.name.toLowerCase().includes(searchTerm));
            renderPlugins(filteredPlugins);
        });

        document.querySelectorAll('#plugins-content .player-sub-nav button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('#plugins-content .player-sub-nav button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const section = button.dataset.pluginSubSection;
                if (section === 'all-plugins') {
                    renderPlugins(pluginsData);
                } else if (section === 'non-working-plugins') {
                    const nonWorkingPlugins = pluginsData.filter(p => p.nonWorking);
                    renderPlugins(nonWorkingPlugins);
                }
            });
        });

        window.pluginsData = pluginsData;
