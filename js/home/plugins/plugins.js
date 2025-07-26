const pluginsData = [
    { name: "EssentialsX", description: "Core plugin for server management, homes, warps, kits, and more.", videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ", detailsLink: "https://essentialsx.net/wiki.html", status: "working" },
    { name: "LuckPerms", description: "Powerful permissions plugin with a web editor.", videoLink: "", detailsLink: "https://luckperms.net/", status: "working" },
    { name: "WorldEdit", description: "Fast and easy to use in-game world editor.", videoLink: "https://www.youtube.com/embed/aYd2I9B5G60", detailsLink: "https://enginehub.org/worldedit/", status: "working" },
    { name: "GriefPrevention", description: "Prevents griefing and protects player builds with land claims.", videoLink: "https://www.youtube.com/embed/p_G-o2r9D2s", detailsLink: "https://www.spigotmc.org/resources/griefprevention.1884/", status: "working" },
    { name: "PlaceholderAPI", description: "Adds placeholders to plugins, allowing dynamic text display.", videoLink: "", detailsLink: "https://www.spigotmc.org/resources/placeholderapi.6245/", status: "working" },
    { name: "Vault", description: "A permissions, chat, & economy API to allow plugins to hook into.", videoLink: "https://www.youtube.com/embed/lIeXvD3xG4w", detailsLink: "https://www.spigotmc.org/resources/vault.34315/", status: "working" },
    { name: "EconomyTaxerWeb", description: "This custom plugin is not made by CraftOne. Unsupported version by Ansh_2613 and i._Sakshamm.", videoLink: "", detailsLink: "", status: "non-working", problem: "This custom plugin is not made by CraftOne. Unsupported version by Ansh_2613 and i._Sakshamm." },
    { name: "Movecraft", description: "Allows players to build and pilot custom ships and vehicles.", videoLink: "https://www.youtube.com/embed/some_movecraft_video", detailsLink: "https://www.spigotmc.org/resources/movecraft.20364/", status: "non-working", problem: "Unsupported version." }
];

let currentPluginFilter = "all-plugins";

function renderPlugins(pluginsToRender) {
    const pluginListElement = document.getElementById("plugin-list");
    pluginListElement.innerHTML = '';

    let filteredPlugins = pluginsToRender;

    if (currentPluginFilter === "non-working-plugins") {
        filteredPlugins = pluginsToRender.filter(p => p.status === "non-working").sort((a,b) => a.name.localeCompare(b.name));
    } else {
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
        let videoHtml = '';
        if (plugin.videoLink) {
            videoHtml = `
                <div class="plugin-video">
                    <iframe src="${plugin.videoLink}"
                            title="${plugin.name} Tutorial"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen>
                    </iframe>
                </div>`;
        } else {
            videoHtml = `
                <div class="plugin-video placeholder">
                    No tutorial video available for this plugin.
                </div>`;
        }

        let problemMessageHtml = '';
        if (plugin.status === "non-working" && plugin.problem) {
            problemMessageHtml = `<p class="problem-message">Problem: ${plugin.problem}</p>`;
            li.classList.add('non-working-plugin');
        }

        li.innerHTML = `
            <h3>${plugin.name}</h3>
            <p class="description">${plugin.description}</p>
            ${problemMessageHtml}
            ${videoHtml}
            <div class="plugin-links">
                ${plugin.detailsLink ? `<a class="plugin-link-btn" href="${plugin.detailsLink}" target="_blank">
                    <i class="fas fa-info-circle"></i> Details
                </a>` : ''}
            </div>
        `;
        pluginListElement.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const pluginSubNavButtons = document.querySelectorAll('#plugins-content .player-sub-nav button');
    const searchInput = document.getElementById("plugin-search");

    pluginSubNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            pluginSubNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentPluginFilter = button.dataset.pluginSubSection;
            renderPlugins(pluginsData);
        });
    });

    searchInput.addEventListener("input", function () {
        const filter = this.value.toLowerCase();
        const filteredPlugins = pluginsData.filter(plugin =>
            plugin.name.toLowerCase().includes(filter) ||
            plugin.description.toLowerCase().includes(filter)
        );
        renderPlugins(filteredPlugins);
    });
});