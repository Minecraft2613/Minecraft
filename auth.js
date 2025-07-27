        import { simulatedCloudflareApi } from './api.js';
        import { showCustomMessage, generateUID } from './utils.js';
        import { renderProfile, handleSuccessfulAuth } from './profile.js';

        const AUTH_SCREEN = document.getElementById('auth-screen');
        const MAIN_AUTH_FORM = document.getElementById('auth-form-main');
        const MAIN_AUTH_SUBMIT_BTN = document.getElementById('main-auth-submit-btn'); // Unified submit button
        const TOGGLE_AUTH_MODE_BTN = document.getElementById('toggle-auth-mode-btn'); // Toggle between login/create
        const MAIN_AUTH_EMAIL_INPUT = document.getElementById('auth-email-input');
        const MAIN_AUTH_PASSWORD_INPUT = document.getElementById('auth-password-input');
        const AUTH_MINECRAFT_USERNAME_INPUT = document.getElementById('auth-minecraft-username-input');
        const AUTH_ACCOUNT_NAME_INPUT = document.getElementById('auth-account-name-input');
        const AUTH_PLATFORM_SELECT = document.getElementById('auth-platform-select'); // New platform select
        const RULES_CHECKBOX_CONTAINER = document.getElementById('rules-checkbox-container');
        const AGREE_RULES_CHECKBOX = document.getElementById('agree-rules-checkbox');
        const MAIN_AUTH_MESSAGE_ELEM = document.getElementById('auth-message-main');
        const AUTH_WELCOME_MESSAGE = document.getElementById('auth-welcome-message');

        let isCreateMode = false; // Initial state: Login

        function setAuthMode(mode) {
            isCreateMode = mode;
            MAIN_AUTH_MESSAGE_ELEM.textContent = ''; // Clear messages

            // Hide all create-account-specific fields first
            AUTH_MINECRAFT_USERNAME_INPUT.style.display = 'none';
            AUTH_ACCOUNT_NAME_INPUT.style.display = 'none';
            AUTH_PLATFORM_SELECT.style.display = 'none';
            document.querySelector('label[for="auth-platform-select"]').style.display = 'none'; // Hide label too
            RULES_CHECKBOX_CONTAINER.style.display = 'none';
            AUTH_MINECRAFT_USERNAME_INPUT.removeEventListener('input', forceDotPrefix); // Remove listener when not in bedrock create mode


            if (isCreateMode) {
                AUTH_WELCOME_MESSAGE.textContent = 'Thanks for Joining!';
                AUTH_MINECRAFT_USERNAME_INPUT.style.display = 'block';
                AUTH_ACCOUNT_NAME_INPUT.style.display = 'block';
                AUTH_PLATFORM_SELECT.style.display = 'block';
                document.querySelector('label[for="auth-platform-select"]').style.display = 'block';
                RULES_CHECKBOX_CONTAINER.style.display = 'flex'; // Show rules checkbox
                MAIN_AUTH_SUBMIT_BTN.textContent = 'Register Account';
                TOGGLE_AUTH_MODE_BTN.textContent = 'Have an account? Login'; // Changed text
            } else {
                AUTH_WELCOME_MESSAGE.textContent = 'Welcome Back!';
                MAIN_AUTH_SUBMIT_BTN.textContent = 'Login';
                TOGGLE_AUTH_MODE_BTN.textContent = 'Don\'t have an account? Create one'; // Changed text
            }
            // Clear inputs when switching modes
            MAIN_AUTH_EMAIL_INPUT.value = '';
            MAIN_AUTH_PASSWORD_INPUT.value = '';
            AUTH_MINECRAFT_USERNAME_INPUT.value = '';
            AUTH_ACCOUNT_NAME_INPUT.value = '';
            AUTH_PLATFORM_SELECT.value = ''; // Reset platform select
            AGREE_RULES_CHECKBOX.checked = false;
        }

        // Event listener for platform selection
        AUTH_PLATFORM_SELECT.addEventListener('change', () => {
            if (AUTH_PLATFORM_SELECT.value === 'bedrock') {
                // Prepend and make non-removable dot for Bedrock
                AUTH_MINECRAFT_USERNAME_INPUT.value = '.';
                AUTH_MINECRAFT_USERNAME_INPUT.addEventListener('input', forceDotPrefix);
            } else {
                AUTH_MINECRAFT_USERNAME_INPUT.removeEventListener('input', forceDotPrefix);
                AUTH_MINECRAFT_USERNAME_INPUT.value = ''; // Clear if not bedrock
            }
        });

        // Function to force the dot prefix for Bedrock usernames
        function forceDotPrefix() {
            if (AUTH_PLATFORM_SELECT.value === 'bedrock' && !AUTH_MINECRAFT_USERNAME_INPUT.value.startsWith('.')) {
                AUTH_MINECRAFT_USERNAME_INPUT.value = '.' + AUTH_MINECRAFT_USERNAME_INPUT.value.replace(/^\.+/, ''); // Ensure only one dot at start
            }
        }


        TOGGLE_AUTH_MODE_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            setAuthMode(!isCreateMode);
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
                    window.currentUser = { email: response.email, uid: response.uid };
                    window.userProfile = response.user;
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
                    window.currentUser = { email: response.email, uid: response.uid };
                    window.userProfile = response.user;
                    sessionStorage.setItem('current_auth_email', email);
                    handleSuccessfulAuth();
                    showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'Login successful!', 'success');
                } else {
                    showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, response.message, 'error');
                }
            }
        });

        export function logoutUser() {
            window.currentUser = null;
            window.userProfile = null;
            sessionStorage.removeItem('current_auth_email');
            AUTH_SCREEN.style.display = 'flex';
            document.getElementById('main-content-wrapper').style.display = 'none';
            setAuthMode(false); // Reset to login mode
        }
