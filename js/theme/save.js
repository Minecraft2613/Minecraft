// --- Save Theme Logic ---
function saveTheme() {
    const root = document.documentElement.style;
    const box = document.getElementById("boxColor").value;
    const glow = document.getElementById("glowColor").value;
    const speed = document.getElementById("glowSpeed").value + "s";
    const brightness = document.getElementById("glowBrightness").value;
    let bg = document.getElementById("bgTheme").value.trim();
    const enableGlow = document.getElementById("glowToggle").checked;
    const textLight = document.getElementById("textLightColor").value;
    const accentGreen = document.getElementById("accentGreenColor").value;
    const accentBlue = document.getElementById("accentBlueColor").value;


    localStorage.setItem("--box-color", box);
    localStorage.setItem("saved-glow-color", glow); /* Store the glow color separately */
    localStorage.setItem("--glow-speed", speed);
    localStorage.setItem("--glow-brightness", brightness);
    localStorage.setItem("--bg-theme", bg);
    localStorage.setItem("--glow-enabled", enableGlow);
    localStorage.setItem("--text-light", textLight);
    localStorage.setItem("--accent-green", accentGreen);
    localStorage.setItem("--accent-blue", accentBlue);


    root.setProperty("--box-color", box);
    root.setProperty("--glow-color", enableGlow ? glow : "transparent");
    root.setProperty("--glow-speed", speed);
    root.setProperty("--glow-brightness", brightness);
    root.setProperty("--bg-theme", bg);
    root.setProperty("--text-light", textLight);
    root.setProperty("--accent-green", accentGreen);
    root.setProperty("--accent-blue", accentBlue);


    showCustomMessage(document.getElementById('theme-settings-content').querySelector('h2'), "🎨 Theme saved!", "success");
}
