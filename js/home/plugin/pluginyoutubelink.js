// --- Plugin YouTube Link Logic ---
function getPluginVideoHtml(plugin) {
    if (plugin.videoLink) {
        return `
            <div class="plugin-video">
                <iframe src="${plugin.videoLink}"
                        title="${plugin.name} Tutorial"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                </iframe>
            </div>`;
    } else {
        return `
            <div class="plugin-video placeholder">
                No tutorial video available for this plugin.
            </div>`;
    }
}