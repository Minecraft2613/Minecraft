// --- Theme Panel Logic ---
function applyTheme() {
    const root = document.documentElement.style;
    const savedBoxColor = localStorage.getItem("--box-color");
    const savedGlowColor = localStorage.getItem("saved-glow-color");
    const savedGlowSpeed = localStorage.getItem("--glow-speed");
    const savedGlowBrightness = localStorage.getItem("--glow-brightness");
    const savedBgTheme = localStorage.getItem("--bg-theme");
    const savedGlowEnabled = localStorage.getItem("--glow-enabled");
    const savedTextLight = localStorage.getItem("--text-light");
    const savedAccentGreen = localStorage.getItem("--accent-green");
    const savedAccentBlue = localStorage.getItem("--accent-blue");


    if (savedBoxColor) root.setProperty('--box-color', savedBoxColor);
    if (savedGlowSpeed) root.setProperty('--glow-speed', savedGlowSpeed);
    if (savedGlowBrightness) root.setProperty('--glow-brightness', savedGlowBrightness);
    if (savedBgTheme) root.setProperty('--bg-theme', savedBgTheme);
    if (savedTextLight) root.setProperty('--text-light', savedTextLight);
    if (savedAccentGreen) root.setProperty('--accent-green', savedAccentGreen);
    if (savedAccentBlue) root.setProperty('--accent-blue', savedAccentBlue);

    // Apply glow based on toggle state
    const glowToggleCheckbox = document.getElementById("glowToggle");
    if (glowToggleCheckbox) {
        glowToggleCheckbox.checked = (savedGlowEnabled === "true");
        root.setProperty('--glow-color', (savedGlowEnabled === "true" && savedGlowColor) ? savedGlowColor : "transparent");
    } else {
        root.setProperty('--glow-color', (savedGlowEnabled === "true" && savedGlowColor) ? savedGlowColor : "transparent");
    }


    // Set input values to current theme values
    document.getElementById("boxColor").value = savedBoxColor || getComputedStyle(document.documentElement).getPropertyValue('--box-color');
    document.getElementById("glowColor").value = savedGlowColor || getComputedStyle(document.documentElement).getPropertyValue('--accent-green');
    document.getElementById("glowSpeed").value = parseFloat((savedGlowSpeed || '3s').replace('s', ''));
    document.getElementById("glowBrightness").value = parseFloat(savedGlowBrightness || '0.6');
    document.getElementById("bgTheme").value = (savedBgTheme && !savedBgTheme.startsWith("url('')") && !savedBgTheme.startsWith("linear-gradient")) ? savedBgTheme : ''; // Clear if complex gradient/url for input
    document.getElementById("textLightColor").value = savedTextLight || getComputedStyle(document.documentElement).getPropertyValue('--text-light');
    document.getElementById("accentGreenColor").value = savedAccentGreen || getComputedStyle(document.documentElement).getPropertyValue('--accent-green');
    document.getElementById("accentBlueColor").value = savedAccentBlue || getComputedStyle(document.documentElement).getPropertyValue('--accent-blue');
}