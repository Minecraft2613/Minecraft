// --- Plugin Link Logic ---
function getPluginDetailsLinkHtml(plugin) {
    if (plugin.detailsLink) {
        return `<a class="plugin-link-btn" href="${plugin.detailsLink}" target="_blank">
                    <i class="fas fa-info-circle"></i> Details
                </a>`;
    }
    return '';
}