        import { simulatedCloudflareApi } from './api.js';
        import { showCustomMessage } from './utils.js';
        import { renderPlugins } from './plugins.js';
        import { fetchServerStatus } from './server.js';
        import { showSection } from './utils.js';

        const PROFILE_FORM = document.getElementById('profile-form');
        const DISPLAY_EMAIL = document.getElementById('display-email');
        const DISPLAY_MINECRAFT_USERNAME = document.getElementById('display-minecraft-username');
        const DISPLAY_MINECRAFT_EDITION = document.getElementById('display-minecraft-edition'); // New display for edition
        const DISPLAY_ACCOUNT_ID = document.getElementById('display-account-id');
        const DISPLAY_ACCOUNT_NAME = document.getElementById('display-account-name');

        const MINECRAFT_USERNAME_INPUT = document.getElementById('minecraft-username');
        const ACCOUNT_NAME_INPUT = document.getElementById('account-name');

        const PROFILE_MESSAGE_ELEM = document.getElementById('profile-message');
        const AVATAR_UPLOAD_INPUT = document.getElementById('avatar-upload');

        const HEADER_PROFILE_DISPLAY = document.getElementById('header-profile-display');
        const HEADER_PROFILE_AVATAR = document.getElementById('header-profile-avatar');
        const HEADER_PROFILE_INITIAL = document.getElementById('header-profile-initial');
        const HEADER_PROFILE_IMAGE = document.getElementById('header-profile-image');
        const PROFILE_DROPDOWN_MENU = document.getElementById('profile-dropdown-menu');

        const CHANGE_PASSWORD_FORM = document.getElementById('change-password-form');
        const CURRENT_PASSWORD_INPUT = document.getElementById('current-password');
        const NEW_PASSWORD_INPUT = document.getElementById('new-password');
        const CONFIRM_NEW_PASSWORD_INPUT = document.getElementById('confirm-new-password');
        const CHANGE_PASSWORD_MESSAGE = document.getElementById('change-password-message');

        // What happens after successful login/create
        export function handleSuccessfulAuth() {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-content-wrapper').style.display = 'block';
            console.log('Auth successful: showing main content.');
            renderProfile(); // Populate profile fields and header profile
            renderPlugins(window.pluginsData); // Initial render of sorted plugins
            showSection('server-info-content'); // Default to SERVER DETAILS on home
            fetchServerStatus(); // Fetch server status immediately
        }

        // Render profile details in Account Settings and header
        export function renderProfile() {
            if (window.currentUser && window.userProfile) {
                // Display fields in Account Settings
                DISPLAY_EMAIL.textContent = window.currentUser.email;
                DISPLAY_MINECRAFT_USERNAME.textContent = window.userProfile.minecraftUsername || 'N/A';
                DISPLAY_MINECRAFT_EDITION.textContent = (window.userProfile.minecraftEdition === 'java' ? 'Java Edition' : (window.userProfile.minecraftEdition === 'bedrock' ? 'Bedrock Edition' : 'N/A')); // Display edition
                DISPLAY_ACCOUNT_ID.textContent = window.currentUser.uid || 'N/A';
                DISPLAY_ACCOUNT_NAME.textContent = window.userProfile.accountName || 'N/A';

                // Input fields (for editing) in Account Settings
                MINECRAFT_USERNAME_INPUT.value = window.userProfile.minecraftUsername || '';
                ACCOUNT_NAME_INPUT.value = window.userProfile.accountName || '';

                // Render header profile picture
                updateAvatarDisplay(window.userProfile.avatar, window.currentUser.email);
            }
        }

        // Update avatar display (large for profile section, small for header)
        function updateAvatarDisplay(avatarDataUrl, email) {
            // Main profile avatar
            const mainProfileImage = document.getElementById('profile-image');
            const mainProfileInitial = document.getElementById('profile-initial');
            if (avatarDataUrl) {
                mainProfileImage.src = avatarDataUrl;
                mainProfileImage.style.display = 'block';
                mainProfileInitial.style.display = 'none';
            } else {
                mainProfileImage.style.display = 'none';
                mainProfileInitial.style.display = 'flex';
                mainProfileInitial.textContent = email ? email.charAt(0).toUpperCase() : '?';
            }

            // Header profile avatar
            if (HEADER_PROFILE_IMAGE && HEADER_PROFILE_INITIAL) {
                if (avatarDataUrl) {
                    HEADER_PROFILE_IMAGE.src = avatarDataUrl;
                    HEADER_PROFILE_IMAGE.style.display = 'block';
                    HEADER_PROFILE_INITIAL.style.display = 'none';
                } else {
                    HEADER_PROFILE_IMAGE.style.display = 'none';
                    HEADER_PROFILE_INITIAL.style.display = 'flex';
                    HEADER_PROFILE_INITIAL.textContent = email ? email.charAt(0).toUpperCase() : '?';
                }
            }
        }

        // Handle profile form submission (saving to simulated Cloudflare KV)
        PROFILE_FORM.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!window.currentUser || !window.userProfile) {
                showCustomMessage(PROFILE_MESSAGE_ELEM, 'Please log in first.', 'error');
                return;
            }

            const updatedProfile = {
                minecraftUsername: MINECRAFT_USERNAME_INPUT.value,
                accountName: ACCOUNT_NAME_INPUT.value,
                avatar: window.userProfile.avatar // Retain current avatar unless changed via file input
            };

            const response = await simulatedCloudflareApi.updateProfile(window.currentUser.email, updatedProfile);

            if (response.success) {
                window.userProfile = response.user; // Update local profile with confirmed changes
                renderProfile(); // Re-render to update display fields and header
                showCustomMessage(PROFILE_MESSAGE_ELEM, 'Profile saved successfully!', 'success');
            } else {
                showCustomMessage(PROFILE_MESSAGE_ELEM, response.message, 'error');
            }
        });

        // Handle avatar upload (saving to simulated Cloudflare KV)
        AVATAR_UPLOAD_INPUT.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && window.currentUser && window.userProfile) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const avatarDataUrl = event.target.result; // Data URL of the image
                    const updatedProfile = { ...window.userProfile, avatar: avatarDataUrl }; // Update avatar in profile

                    const response = await simulatedCloudflareApi.updateProfile(window.currentUser.email, updatedProfile);

                    if (response.success) {
                        window.userProfile = response.user; // Update local profile
                        updateAvatarDisplay(window.userProfile.avatar, window.currentUser.email);
                        showCustomMessage(PROFILE_MESSAGE_ELEM, 'Profile picture updated!', 'success');
                    } else {
                        showCustomMessage(PROFILE_MESSAGE_ELEM, response.message, 'error');
                    }
                };
                reader.readAsDataURL(file); // Read file as Data URL
            } else if (!window.currentUser) {
                showCustomMessage(PROFILE_MESSAGE_ELEM, 'Please log in to upload an avatar.', 'error');
            }
        });

        // Toggle profile dropdown in header
        if (HEADER_PROFILE_AVATAR) {
            HEADER_PROFILE_AVATAR.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from closing immediately
                PROFILE_DROPDOWN_MENU.classList.toggle('active');
            });
            // Close dropdown if clicked outside
            document.addEventListener('click', (e) => {
                if (!HEADER_PROFILE_DISPLAY.contains(e.target)) {
                    PROFILE_DROPDOWN_MENU.classList.remove('active');
                }
            });
        }

        CHANGE_PASSWORD_FORM.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!window.currentUser) {
                showCustomMessage(CHANGE_PASSWORD_MESSAGE, 'Please log in first.', 'error');
                return;
            }

            const currentPassword = CURRENT_PASSWORD_INPUT.value;
            const newPassword = NEW_PASSWORD_INPUT.value;
            const confirmNewPassword = CONFIRM_NEW_PASSWORD_INPUT.value;

            if (newPassword !== confirmNewPassword) {
                showCustomMessage(CHANGE_PASSWORD_MESSAGE, 'New passwords do not match.', 'error');
                return;
            }

            const response = await simulatedCloudflareApi.changePassword(window.currentUser.email, currentPassword, newPassword);

            if (response.success) {
                showCustomMessage(CHANGE_PASSWORD_MESSAGE, response.message, 'success');
                CHANGE_PASSWORD_FORM.reset();
            } else {
                showCustomMessage(CHANGE_PASSWORD_MESSAGE, response.message, 'error');
            }
        });
