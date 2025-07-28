// --- Plugin Data & Render Logic ---
const pluginsData = [
    { name: "EssentialsX", description: "Core plugin for server management, homes, warps, kits, and more.", videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ", detailsLink: "https://essentialsx.net/wiki.html", status: "working" },
    { name: "LuckPerms", description: "Powerful permissions plugin with a web editor.", videoLink: "", detailsLink: "https://luckperms.net/", status: "working" },
    { name: "WorldEdit", description: "Fast and easy to use in-game world editor.", videoLink: "https://www.youtube.com/embed/aYd2I9B5G60", detailsLink: "https://enginehub.org/worldedit/", status: "working" },
    { name: "GriefPrevention", description: "Prevents griefing and protects player builds with land claims.", videoLink: "https://www.youtube.com/embed/p_G-o2r9D2s", detailsLink: "https://www.spigotmc.org/resources/griefprevention.1884/", status: "working" },
    { name: "PlaceholderAPI", description: "Adds placeholders to plugins, allowing dynamic text display.", videoLink: "", detailsLink: "https://www.spigotmc.org/resources/placeholderapi.6245/", status: "working" },
    { name: "Vault", description: "A permissions, chat, & economy API to allow plugins to hook into.", videoLink: "https://www.youtube.com/embed/lIeXvD3xG4w", detailsLink: "https://www.spigotmc.org/resources/vault.34315/", status: "working" },
    { name: "EconomyTaxerWeb", description: "This custom plugin is not made by CraftOne. Unsupported version by Ansh_2613 and i._Sakshamm.", videoLink: "", detailsLink: "", status: "non-working", problem: "This custom plugin is not made by CraftOne. Unsupported version by Ansh_2613 and i._Sakshamm." }, // Updated problem
    { name: "Movecraft", description: "Allows players to build and pilot custom ships and vehicles.", videoLink: "https://www.youtube.com/embed/some_movecraft_video", detailsLink: "https://www.spigotmc.org/resources/movecraft.20364/", status: "non-working", problem: "Unsupported version." } // Updated problem
    // Add more plugins here with their status
];

const pluginSubNavButtons = document.querySelectorAll('#plugins-content .player-sub-nav button');
let currentPluginFilter = "all-plugins"; // Default filter

function renderPlugins(pluginsToRender) {
    const pluginListElement = document.getElementById("plugin-list");
    pluginListElement.innerHTML = ''; // Clear existing list

    let filteredPlugins = pluginsToRender;

    if (currentPluginFilter === "non-working-plugins") {
        filteredPlugins = pluginsToRender.filter(p => p.status === "non-working").sort((a,b) => a.name.localeCompare(b.name));
    } else { // "all-plugins" - sort working first, then non-working
        const workingPlugins = pluginsToRender.filter(p => p.status === "working").sort((a,b) => a.name.localeCompare(b.name));
        const nonWorkingPlugins = pluginsToRender.filter(p => p.status === "non-working").sort((a,b) => a.name.localeCompare(b.name));
        filteredPlugins = [...workingPlugins, ...nonWorkingPlugins];
    }


    if (filteredPlugins.length === 0) {
        pluginListElement.innerHTML = '<li style="text-align: center; color: #ccc; padding: 20px;">No plugins found matching your criteria.</li>';
        return;
    }

    filteredPlugins.forEach(plugin => {
        const li = document.createElement("li");
        const videoHtml = getPluginVideoHtml(plugin);
        const detailsLinkHtml = getPluginDetailsLinkHtml(plugin);

        let problemMessageHtml = '';
        if (plugin.status === "non-working" && plugin.problem) {
            problemMessageHtml = `<p class="problem-message">Problem: ${plugin.problem}</p>`;
            li.classList.add('non-working-plugin'); // Add class for styling
        }

        li.innerHTML = `
            <h3>${plugin.name}</h3>
            <p class="description">${plugin.description}</p>
            ${problemMessageHtml}
            ${videoHtml}
            <div class="plugin-links">
                ${detailsLinkHtml}
            </div>
        `;
        pluginListElement.appendChild(li);
    });
}

// Plugin sub-navigation click handlers
pluginSubNavButtons.forEach(button => {
    button.addEventListener('click', () => {
        pluginSubNavButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentPluginFilter = button.dataset.pluginSubSection;
        renderPlugins(pluginsData); // Re-render with new filter
    });
});


// Plugin Search Filter (filters the currently displayed set)
const searchInput = document.getElementById("plugin-search");
searchInput.addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    let pluginsToSearch = pluginsData;
    // The sorting logic in renderPlugins already handles the "all-plugins" view
    // and the "non-working-plugins" filter.
    // We only need to pass the full pluginsData to renderPlugins and let it sort/filter.

    const filteredPlugins = pluginsToSearch.filter(plugin =>
        plugin.name.toLowerCase().includes(filter) ||
        plugin.description.toLowerCase().includes(filter)
    );
    renderPlugins(filteredPlugins); // Always re-render based on current filter and search
});