function renderProfile() {
            if (currentUser) {
                document.getElementById('display-email').textContent = currentUser.email;
                document.getElementById('display-minecraft-username').textContent = currentUser.username || 'N/A'; // Use currentUser.username
                // Removed minecraftEdition as it's not stored in the consolidated account
                document.getElementById('display-account-id').textContent = currentUser.accountId || 'N/A'; // Use currentUser.accountId
                document.getElementById('display-account-name').textContent = currentUser.bankId || 'N/A'; // Use currentUser.bankId
                document.getElementById('minecraft-username').value = currentUser.username || ''; // Use currentUser.username
                // Removed account-name input as bankId is not updated via this form
                updateAvatarDisplay(currentUser.settings.profilePictureUrl, currentUser.email); // Use profilePictureUrl from settings
            }
        }

        function updateAvatarDisplay(profilePictureUrl, email) {
            const mainProfileImage = document.getElementById('profile-image');
            const mainProfileInitial = document.getElementById('profile-initial');
            if (profilePictureUrl) {
                mainProfileImage.src = profilePictureUrl;
                mainProfileImage.style.display = 'block';
                mainProfileInitial.style.display = 'none';
            } else {
                mainProfileImage.style.display = 'none';
                mainProfileInitial.style.display = 'flex';
                mainProfileInitial.textContent = email ? email.charAt(0).toUpperCase() : '?';
            }

            const HEADER_PROFILE_IMAGE = document.getElementById('header-profile-image');
            const HEADER_PROFILE_INITIAL = document.getElementById('header-profile-initial');
            if (HEADER_PROFILE_IMAGE && HEADER_PROFILE_INITIAL) {
                if (profilePictureUrl) {
                    HEADER_PROFILE_IMAGE.src = profilePictureUrl;
                    HEADER_PROFILE_IMAGE.style.display = 'block';
                    HEADER_PROFILE_INITIAL.style.display = 'none';
                } else {
                    HEADER_PROFILE_IMAGE.style.display = 'none';
                    HEADER_PROFILE_INITIAL.style.display = 'flex';
                    HEADER_PROFILE_INITIAL.textContent = email ? email.charAt(0).toUpperCase() : '?';
                }
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const PROFILE_FORM = document.getElementById('profile-form');
            const PROFILE_MESSAGE_ELEM = document.getElementById('profile-message');
            const AVATAR_UPLOAD_INPUT = document.getElementById('avatar-upload');

            PROFILE_FORM.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!currentUser) {
                    showCustomMessage(PROFILE_MESSAGE_ELEM, 'Please log in first.', 'error');
                    return;
                }

                const updatedSettingsPayload = {
                    settings: {
                        displayName: document.getElementById('minecraft-username').value,
                        profilePictureUrl: currentUser.settings.profilePictureUrl // Keep existing if not changed by avatar upload
                    }
                };

                const response = await simulatedCloudflareApi.updateProfile(currentUser.accountId, updatedSettingsPayload);

                if (response.success) {
                    currentUser = response.user; // Update currentUser with the latest data
                    renderProfile();
                    showCustomMessage(PROFILE_MESSAGE_ELEM, 'Profile saved successfully!', 'success');
                } else {
                    showCustomMessage(PROFILE_MESSAGE_ELEM, response.message, 'error');
                }
            });

            AVATAR_UPLOAD_INPUT.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file && currentUser) {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        const avatarDataUrl = event.target.result;
                        
                        const updatedSettingsPayload = {
                            settings: {
                                profilePictureUrl: avatarDataUrl
                            }
                        };

                        const response = await simulatedCloudflareApi.updateProfile(currentUser.accountId, updatedSettingsPayload);

                        if (response.success) {
                            currentUser = response.user; // Update currentUser with the latest data
                            updateAvatarDisplay(currentUser.settings.profilePictureUrl, currentUser.email);
                            showCustomMessage(PROFILE_MESSAGE_ELEM, 'Profile picture updated!', 'success');
                        } else {
                            showCustomMessage(PROFILE_MESSAGE_ELEM, response.message, 'error');
                        }
                    };
                    reader.readAsDataURL(file);
                } else if (!currentUser) {
                    showCustomMessage(PROFILE_MESSAGE_ELEM, 'Please log in to upload an avatar.', 'error');
                }
            });

            const CHANGE_PASSWORD_FORM = document.getElementById('change-password-form');
            const CURRENT_PASSWORD_INPUT = document.getElementById('current-password');
            const NEW_PASSWORD_INPUT = document.getElementById('new-password');
            const CONFIRM_NEW_PASSWORD_INPUT = document.getElementById('confirm-new-password');
            const CHANGE_PASSWORD_MESSAGE = document.getElementById('change-password-message');

            CHANGE_PASSWORD_FORM.addEventListener('submit', async (e) => {
                e.preventDefault();
                CHANGE_PASSWORD_MESSAGE.textContent = '';
                const currentPassword = CURRENT_PASSWORD_INPUT.value;
                const newPassword = NEW_PASSWORD_INPUT.value;
                const confirmNewPassword = CONFIRM_NEW_PASSWORD_INPUT.value;

                if (!currentPassword || !newPassword || !confirmNewPassword) {
                    showCustomMessage(CHANGE_PASSWORD_MESSAGE, 'All password fields are required.', 'error');
                    return;
                }
                if (newPassword.length < 6) {
                    showCustomMessage(CHANGE_PASSWORD_MESSAGE, 'New password must be at least 6 characters long.', 'error');
                    return;
                }
                if (newPassword !== confirmNewPassword) {
                    showCustomMessage(CHANGE_PASSWORD_MESSAGE, 'New password and confirmation do not match.', 'error');
                    return;
                }

                // This call will currently warn that the functionality is not implemented in the worker.
                const response = await simulatedCloudflareApi.changePassword(currentUser.email, currentPassword, newPassword);

                if (response.success) {
                    showCustomMessage(CHANGE_PASSWORD_MESSAGE, response.message, 'success');
                    CURRENT_PASSWORD_INPUT.value = '';
                    NEW_PASSWORD_INPUT.value = '';
                    CONFIRM_NEW_PASSWORD_INPUT.value = '';
                } else {
                    showCustomMessage(CHANGE_PASSWORD_MESSAGE, response.message, 'error');
                }
            });
        });