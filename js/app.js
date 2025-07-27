document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('hidden');
    console.log('DOMContentLoaded: Loading screen hidden.');

    loadingScreen.addEventListener('transitionend', async () => { // Made async to await API call
        loadingScreen.remove();
        console.log('Loading screen removed from DOM.');

        const mainContentWrapper = document.getElementById("main-content-wrapper");
        const authScreen = document.getElementById("auth-screen");

        const storedAuthAccountId = sessionStorage.getItem('current_auth_accountId'); // Use accountId for re-login
        if (storedAuthAccountId) {
            console.log('Found stored accountId in session. Attempting re-login...');
            const response = await simulatedCloudflareApi.getAccountDetails(storedAuthAccountId);

            if (response.success) {
                currentUser = response.account; // Set currentUser to the full account object
                userProfile = response.account; // Set userProfile to the full account object
                console.log('Re-login successful with stored accountId. User:', currentUser.email);
                handleSuccessfulAuth();
            } else {
                console.log('Account details not found for stored accountId. Showing auth screen.', response.message);
                sessionStorage.removeItem('current_auth_email'); // Clear old session data
                sessionStorage.removeItem('current_auth_accountId');
                setAuthMode(false);
                authScreen.style.display = "flex";
                mainContentWrapper.style.display = "none";
            }
        } else {
            console.log('No stored accountId found. Showing auth screen.');
            setAuthMode(false);
            authScreen.style.display = "flex";
            mainContentWrapper.style.display = "none";
        }

        // These functions will need to be updated to use the new API endpoints
        // renderPlugins(pluginsData);
        // showPlayerSubSection('top-richest-content');
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

    // Theme related event listeners - these functions (saveTheme, resetTheme) need to be updated
    // to use simulatedCloudflareApi.updateProfile with the correct payload structure.
    document.getElementById("glowToggle").addEventListener('change', function() {
        // saveTheme(); // Needs update
    });

    document.getElementById("boxColor").addEventListener('input', function() {
        // saveTheme(); // Needs update
    });
    document.getElementById("glowColor").addEventListener('input', function() {
        // saveTheme(); // Needs update
    });
    document.getElementById("glowSpeed").addEventListener('input', function() {
        // saveTheme(); // Needs update
    });
    document.getElementById("bgTheme").addEventListener('input', function() {
        // saveTheme(); // Needs update
    });
    document.getElementById("textLightColor").addEventListener('input', function() {
        // saveTheme(); // Needs update
    });
    document.getElementById("accentGreenColor").addEventListener('input', function() {
        // saveTheme(); // Needs update
    });
    document.getElementById("accentBlueColor").addEventListener('input', function() {
        // saveTheme(); // Needs update
    });

    document.querySelector('#theme-settings-content button[onclick="saveTheme()"]').addEventListener('click', function() {
        // saveTheme(); // Needs update
    });
    document.querySelector('#theme-settings-content button[onclick="resetTheme()"]').addEventListener('click', function() {
        // resetTheme(); // Needs update
    });

    // These functions will need to be updated to use the new API endpoints
    // fetchServerStatus();
    // setInterval(fetchServerStatus, 5000);
});