// --- Verification Logic ---

// What happens after successful login/create
function handleSuccessfulAuth() {
    AUTH_SCREEN.style.display = 'none';
    document.getElementById('main-content-wrapper').style.display = 'block';
    console.log('Auth successful: showing main content.');
    renderProfile(); // Populate profile fields and header profile
    renderPlugins(pluginsData); // Initial render of sorted plugins
    showSection('server-info-content'); // Default to SERVER DETAILS on home
    fetchServerStatus(); // Fetch server status immediately
}

// --- Initial Load & Authentication Check ---
window.addEventListener("DOMContentLoaded", async () => {
    applyTheme(); // Apply saved theme on load
    console.log('DOM Content Loaded. Checking authentication status...');

    const mainContentWrapper = document.getElementById("main-content-wrapper");
    const authScreen = document.getElementById("auth-screen");

    const storedAuthEmail = sessionStorage.getItem('current_auth_email');
    if (storedAuthEmail) {
        console.log('Found stored email in session. Attempting to fetch profile...');
        const response = await simulatedCloudflareApi.getProfile(storedAuthEmail);

        if (response.success) {
            currentUser = { email: storedAuthEmail, uid: response.user.uid };
            userProfile = response.user;
            console.log('Re-login successful with stored email. User:', currentUser.email);
            handleSuccessfulAuth();
        } else {
            console.log('Could not fetch profile for stored email. Showing auth screen.');
            sessionStorage.removeItem('current_auth_email'); // Clear invalid session
            window.setAuthMode(false); // Default to login mode
            authScreen.style.display = "flex";
            mainContentWrapper.style.display = "none";
        }
    } else {
        console.log('No stored email found. Showing auth screen.');
        window.setAuthMode(false); // Default to login mode
        authScreen.style.display = "flex";
        mainContentWrapper.style.display = "none";
    }

    // Initial render of plugins (alphabetical order with non-working at bottom)
    renderPlugins(pluginsData);
    // Initial render for players section (default to richest)
    showPlayerSubSection('top-richest-content');
});
