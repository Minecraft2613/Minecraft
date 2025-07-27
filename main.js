        import { handleDOMContentLoaded, showSection, toggleSidebar, toggleProfileDropdown, copyToClipboard } from './utils.js';
        import { simulatedCloudflareApi } from './api.js';
        import { logoutUser } from './auth.js';
        import { renderProfile, handleSuccessfulAuth } from './profile.js';
        import { saveTheme, resetTheme, loadTheme } from './theme.js';
        import { fetchServerStatus } from './server.js';
        import { renderPlugins } from './plugins.js';
        import { initPlayers } from './players.js';
        import './contact.js';

        document.addEventListener('DOMContentLoaded', () => {
            handleDOMContentLoaded();
            loadTheme();
            initPlayers();

            // Check for logged in user
            const loggedInEmail = sessionStorage.getItem('current_auth_email');
            if (loggedInEmail) {
                // In a real app, you'd verify the session with the backend.
                // For this simulation, we'll just re-fetch the user data.
                const userJson = localStorage.getItem('cloudflare_kv_sim') ? JSON.parse(localStorage.getItem('cloudflare_kv_sim'))[loggedInEmail] : null;
                if (userJson) {
                    const user = JSON.parse(userJson);
                    window.currentUser = { email: user.email, uid: user.uid };
                    window.userProfile = user.profile;
                    handleSuccessfulAuth();
                }
            }
        });

        // Expose functions to the global scope for inline event handlers
        window.toggleSidebar = toggleSidebar;
        window.showSection = showSection;
        window.toggleProfileDropdown = toggleProfileDropdown;
        window.logoutUser = logoutUser;
        window.copyToClipboard = copyToClipboard;
        window.saveTheme = saveTheme;
        window.resetTheme = resetTheme;
