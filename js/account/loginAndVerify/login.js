const AUTH_SCREEN = document.getElementById('auth-screen');
        const MAIN_AUTH_FORM = document.getElementById('auth-form-main');
        const MAIN_AUTH_SUBMIT_BTN = document.getElementById('main-auth-submit-btn');
        const TOGGLE_AUTH_MODE_BTN = document.getElementById('toggle-auth-mode-btn');
        const MAIN_AUTH_EMAIL_INPUT = document.getElementById('auth-email-input');
        const MAIN_AUTH_PASSWORD_INPUT = document.getElementById('auth-password-input');
        const AUTH_MINECRAFT_USERNAME_INPUT = document.getElementById('auth-minecraft-username-input');
        const AUTH_ACCOUNT_NAME_INPUT = document.getElementById('auth-account-name-input');
        const AUTH_PLATFORM_SELECT = document.getElementById('auth-platform-select');
        const RULES_CHECKBOX_CONTAINER = document.getElementById('rules-checkbox-container');
        const AGREE_RULES_CHECKBOX = document.getElementById('agree-rules-checkbox');
        const MAIN_AUTH_MESSAGE_ELEM = document.getElementById('auth-message-main');
        const AUTH_WELCOME_MESSAGE = document.getElementById('auth-welcome-message');

        function setAuthMode(mode) {
            isCreateMode = mode;
            MAIN_AUTH_MESSAGE_ELEM.textContent = '';

            AUTH_MINECRAFT_USERNAME_INPUT.style.display = 'none';
            AUTH_ACCOUNT_NAME_INPUT.style.display = 'none';
            AUTH_PLATFORM_SELECT.style.display = 'none';
            document.querySelector('label[for="auth-platform-select"]').style.display = 'none';
            RULES_CHECKBOX_CONTAINER.style.display = 'none';
            AUTH_MINECRAFT_USERNAME_INPUT.removeEventListener('input', forceDotPrefix);

            if (isCreateMode) {
                AUTH_WELCOME_MESSAGE.textContent = 'Thanks for Joining!';
                AUTH_MINECRAFT_USERNAME_INPUT.style.display = 'block';
                AUTH_ACCOUNT_NAME_INPUT.style.display = 'block';
                AUTH_PLATFORM_SELECT.style.display = 'block';
                document.querySelector('label[for="auth-platform-select"]').style.display = 'block';
                RULES_CHECKBOX_CONTAINER.style.display = 'flex';
                MAIN_AUTH_SUBMIT_BTN.textContent = 'Register Account';
                TOGGLE_AUTH_MODE_BTN.textContent = 'Have an account? Login';
            } else {
                AUTH_WELCOME_MESSAGE.textContent = 'Welcome Back!';
                MAIN_AUTH_SUBMIT_BTN.textContent = 'Login';
                TOGGLE_AUTH_MODE_BTN.textContent = 'Don\'t have an account? Create one';
            }
            MAIN_AUTH_EMAIL_INPUT.value = '';
            MAIN_AUTH_PASSWORD_INPUT.value = '';
            AUTH_MINECRAFT_USERNAME_INPUT.value = '';
            AUTH_ACCOUNT_NAME_INPUT.value = '';
            AUTH_PLATFORM_SELECT.value = '';
            AGREE_RULES_CHECKBOX.checked = false;
        }

        function forceDotPrefix() {
            if (AUTH_PLATFORM_SELECT.value === 'bedrock' && !AUTH_MINECRAFT_USERNAME_INPUT.value.startsWith('.')) {
                AUTH_MINECRAFT_USERNAME_INPUT.value = '.' + AUTH_MINECRAFT_USERNAME_INPUT.value.replace(/^\.+/, '');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            AUTH_PLATFORM_SELECT.addEventListener('change', () => {
                if (AUTH_PLATFORM_SELECT.value === 'bedrock') {
                    AUTH_MINECRAFT_USERNAME_INPUT.value = '.';
                    AUTH_MINECRAFT_USERNAME_INPUT.addEventListener('input', forceDotPrefix);
                } else {
                    AUTH_MINECRAFT_USERNAME_INPUT.removeEventListener('input', forceDotPrefix);
                    AUTH_MINECRAFT_USERNAME_INPUT.value = '';
                }
            });

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
                    const minecraftUsername = AUTH_MINECRAFT_USERNAME_INPUT.value.trim();
                    const accountName = AUTH_ACCOUNT_NAME_INPUT.value.trim();
                    const minecraftEdition = AUTH_PLATFORM_SELECT.value;

                    if (!email || !password || !minecraftUsername || !accountName || !minecraftEdition) {
                        showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'Please fill all required fields for registration (including Minecraft Edition).', 'error');
                        return;
                    }
                    if (!AGREE_RULES_CHECKBOX.checked) {
                        showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'You must agree to the Minecraft Server Rules to create an account.', 'error');
                        return;
                    }

                    const response = await simulatedCloudflareApi.register(email, password, minecraftUsername, accountName, minecraftEdition);

                    if (response.success) {
                        showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'Account created successfully! Please log in.', 'success');
                        setAuthMode(false); // Switch to login mode after successful registration
                    } else {
                        showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, response.message, 'error');
                    }

                } else {
                    const response = await simulatedCloudflareApi.login(email, password); // Use email as identifier

                    if (response.success) {
                        currentUser = response.user; // Full account object
                        userProfile = response.user; // Full account object
                        sessionStorage.setItem('current_auth_email', currentUser.email);
                        sessionStorage.setItem('current_auth_accountId', currentUser.accountId); // Store accountId
                        handleSuccessfulAuth();
                        showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, 'Login successful!', 'success');
                    } else {
                        showCustomMessage(MAIN_AUTH_MESSAGE_ELEM, response.message, 'error');
                    }
                }
            });
        });