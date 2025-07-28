// --- Default Theme Logic ---
function resetTheme() {
    const defaults = {
        "--box-color": "#0d0d0d",
        "saved-glow-color": "#00ffcc",
        "--glow-speed": "3s",
        "--glow-brightness": "0.6",
        "--bg-theme": "linear-gradient(-45deg, #0a0a0a, #111111, #1a1a1a, #0d0d0d)",
        "--glow-enabled": "false",
        "--text-light": "#e0e0e0",
        "--accent-green": "#00ffcc",
        "--accent-blue": "#42a5f5"
    };

    for (let key in defaults) {
        localStorage.setItem(key, defaults[key]);
    }
    applyTheme(); // Re-apply the default theme
    showCustomMessage(document.getElementById('theme-settings-content').querySelector('h2'), "🔄 Theme reset to default and glow disabled.", "success");
}
