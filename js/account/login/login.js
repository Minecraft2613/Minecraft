// --- Login Logic ---
let currentUser = null; // Stores email, uid
let userProfile = null; // Stores detailed profile data

const AUTH_SCREEN = document.getElementById('auth-screen');
const MAIN_AUTH_FORM = document.getElementById('auth-form-main');
const MAIN_AUTH_SUBMIT_BTN = document.getElementById('main-auth-submit-btn'); // Unified submit button
const TOGGLE_AUTH_MODE_BTN = document.getElementById('toggle-auth-mode-btn'); // Toggle between login/create
const MAIN_AUTH_EMAIL_INPUT = document.getElementById('auth-email-input');
const MAIN_AUTH_PASSWORD_INPUT = document.getElementById('auth-password-input');
const MAIN_AUTH_MESSAGE_ELEM = document.getElementById('auth-message-main');
const AUTH_WELCOME_MESSAGE = document.getElementById('auth-welcome-message');
const AUTH_MINECRAFT_USERNAME_INPUT = document.getElementById('auth-minecraft-username-input');
const AUTH_ACCOUNT_NAME_INPUT = document.getElementById('auth-account-name-input');
const AUTH_PLATFORM_SELECT = document.getElementById('auth-platform-select'); // New platform select
const RULES_CHECKBOX_CONTAINER = document.getElementById('rules-checkbox-container');
const AGREE_RULES_CHECKBOX = document.getElementById('agree-rules-checkbox'); // Added comment to force reload

// --- Auth Mode Toggle (Login / Create Account) ---
let isCreateMode = false; // Initial state: Login

TOGGLE_AUTH_MODE_BTN.addEventListener('click', (e) => {
    e.preventDefault();
    window.setAuthMode(!isCreateMode);
});

MAIN_AUTH_SUBMIT_BTN.addEventListener('click', async (e) => {
    e.preventDefault();
    MAIN_AUTH_MESSAGE_ELEM.textContent = '';

    const email = MAIN_AUTH_EMAIL_INPUT.value;
    const password = MAIN_AUTH_PASSWORD_INPUT.value;

    if (isCreateMode) {
        // Register logic
        const minecraftUsername = AUTH_MINECRAFT_USERNAME_INPUT.value.trim();
        const accountName = AUTH_ACCOUNT_NAME_INPUT.value.trim();
        const minecraftEdition = AUTH_PLATFORM_SELECT.value; // Get selected edition

        if (!email || !password || !minecraftUsername || !accountName || !minecraftEdition) {
            showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'Please fill all required fields for registration (including Minecraft Edition).', 'error');
            return;
        }
        if (!AGREE_RULES_CHECKBOX.checked) {
            showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'You must agree to the Minecraft Server Rules to create an account.', 'error');
            return;
        }

        const response = await simulatedCloudflareApi.register(email, password, minecraftUsername, accountName, minecraftEdition); // Pass edition

        if (response.success) {
            currentUser = { email: response.email, uid: response.uid };
            userProfile = response.user;
            sessionStorage.setItem('current_auth_email', email);
            handleSuccessfulAuth();
            showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'Account created successfully!', 'success');
        } else {
            showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, response.message, 'error');
        }

    } else {
        // Login logic
        const response = await simulatedCloudflareApi.login(email, password);

        if (response.success) {
            currentUser = { email: response.email, uid: response.uid };
            userProfile = response.user;
            sessionStorage.setItem('current_auth_email', email);
            handleSuccessfulAuth();
            showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'Login successful!', 'success');
        } else {
            showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, response.message, 'error');
        }
    }
});

// Simple UID generator (for demo purposes)
function generateUID(email) {
    return 'user_' + btoa(email).replace(/=/g, '').substring(0, 10) + '_' + Date.now().toString().slice(-4);
}

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
window.addEventListener("DOMContentLoaded", () => {
    applyTheme(); // Apply saved theme on load
    console.log('DOM Content Loaded. Checking authentication status...');

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
            sessionStorage.removeItem('current_auth_email'); // Clear invalid session
            setAuthMode(false); // Default to login mode
            authScreen.style.display = "flex";
            mainContentWrapper.style.display = "none";
        }
    } else {
        console.log('No stored email found. Showing auth screen.');
        setAuthMode(false); // Default to login mode
        authScreen.style.display = "flex";
        mainContentWrapper.style.display = "none";
    }

    // Initial render of plugins (alphabetical order with non-working at bottom)
    renderPlugins(pluginsData);
    // Initial render for players section (default to richest)
    showPlayerSubSection('top-richest-content');
});