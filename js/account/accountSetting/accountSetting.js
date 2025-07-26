        function renderProfile() {
            if (currentUser && userProfile) {
                document.getElementById('display-email').textContent = currentUser.email;
                document.getElementById('display-minecraft-username').textContent = userProfile.minecraftUsername || 'N/A';
                document.getElementById('display-minecraft-edition').textContent = (userProfile.minecraftEdition === 'java' ? 'Java Edition' : (userProfile.minecraftEdition === 'bedrock' ? 'Bedrock Edition' : 'N/A'));
                document.getElementById('display-account-id').textContent = currentUser.uid || 'N/A';
                document.getElementById('display-account-name').textContent = userProfile.accountName || 'N/A';
                document.getElementById('minecraft-username').value = userProfile.minecraftUsername || '';
                document.getElementById('account-name').value = userProfile.accountName || '';
                updateAvatarDisplay(userProfile.avatar, currentUser.email);
            }
        }

        function updateAvatarDisplay(avatarDataUrl, email) {
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

            const HEADER_PROFILE_IMAGE = document.getElementById('header-profile-image');
            const HEADER_PROFILE_INITIAL = document.getElementById('header-profile-initial');
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

        document.addEventListener('DOMContentLoaded', () => {
            const PROFILE_FORM = document.getElementById('profile-form');
            const PROFILE_MESSAGE_ELEM = document.getElementById('profile-message');
            const AVATAR_UPLOAD_INPUT = document.getElementById('avatar-upload');

            PROFILE_FORM.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!currentUser || !userProfile) {
                    showCustomMessage(PROFILE_MESSAGE_ELEM, 'Please log in first.', 'error');
                    return;
                }

                const updatedProfile = {
                    minecraftUsername: document.getElementById('minecraft-username').value,
                    accountName: document.getElementById('account-name').value,
                    avatar: userProfile.avatar
                };

                const response = await simulatedCloudflareApi.updateProfile(currentUser.email, updatedProfile);

                if (response.success) {
                    userProfile = response.user;
                    renderProfile();
                    showCustomMessage(PROFILE_MESSAGE_ELEM, 'Profile saved successfully!', 'success');
                } else {
                    showCustomMessage(PROFILE_MESSAGE_ELEM, response.message, 'error');
                }
            });

            AVATAR_UPLOAD_INPUT.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file && currentUser && userProfile) {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        const avatarDataUrl = event.target.result;
                        const updatedProfile = { ...userProfile, avatar: avatarDataUrl };

                        const response = await simulatedCloudflareApi.updateProfile(currentUser.email, updatedProfile);

                        if (response.success) {
                            userProfile = response.user;
                            updateAvatarDisplay(userProfile.avatar, currentUser.email);
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
