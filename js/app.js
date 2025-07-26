document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    console.log('DOMContentLoaded: Loading screen hidden.');

    loadingScreen.addEventListener('transitionend', () => {
        loadingScreen.remove();
        console.log('Loading screen removed from DOM.');

        const mainContentWrapper = document.getElementById("main-content-wrapper");
        const authScreen = document.getElementById("auth-screen");

        const storedAuthEmail = sessionStorage.getItem('current_auth_email');
        if (storedAuthEmail) {
            console.log('Found stored email in session. Attempting re-login...');
            const userJson = getSimulatedKVItem(storedAuthEmail);
            if (userJson) {
                const user = JSON.parse(userJson);
                currentUser = { email: user.email, uid: user.uid };
                userProfile = user.profile;
                console.log('Re-login successful with stored email. User:', currentUser.email);
                handleSuccessfulAuth();
            } else {
                console.log('Stored email not found in simulated KV. Showing auth screen.');
                sessionStorage.removeItem('current_auth_email');
                setAuthMode(false);
                authScreen.style.display = "flex";
                mainContentWrapper.style.display = "none";
            }
        } else {
            console.log('No stored email found. Showing auth screen.');
            setAuthMode(false);
            authScreen.style.display = "flex";
            mainContentWrapper.style.display = "none";
        }

        renderPlugins(pluginsData);
        showPlayerSubSection('top-richest-content');
    });

    document.getElementById('sidebar-logout-btn').addEventListener('click', logoutUser);

    document.querySelectorAll('#sidebar nav a').forEach(link => {
        if (link.href && link.target === '_blank') {
            link.addEventListener('click', (e) => {
            });
        } else if (link.dataset.section) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(link.dataset.section);
                toggleSidebar();
            });
        }
    });

    document.getElementById("glowToggle").addEventListener('change', function() {
        saveTheme();
    });

    document.getElementById("boxColor").addEventListener('input', saveTheme);
    document.getElementById("glowColor").addEventListener('input', saveTheme);
    document.getElementById("glowSpeed").addEventListener('input', saveTheme);
    document.getElementById("glowBrightness").addEventListener('input', saveTheme);
    document.getElementById("bgTheme").addEventListener('input', saveTheme);
    document.getElementById("textLightColor").addEventListener('input', saveTheme);
    document.getElementById("accentGreenColor").addEventListener('input', saveTheme);
    document.getElementById("accentBlueColor").addEventListener('input', saveTheme);

    document.querySelector('#theme-settings-content button[onclick="saveTheme()"]').addEventListener('click', saveTheme);
    document.querySelector('#theme-settings-content button[onclick="resetTheme()"]').addEventListener('click', resetTheme);

    fetchServerStatus();
    setInterval(fetchServerStatus, 5000);
});