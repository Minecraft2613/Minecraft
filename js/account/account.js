        let currentUser = null;
        let userProfile = null;

        const simulatedCloudflareApi = {
            async login(email, password) {
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': WORKER_API_KEY
                        },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        console.log('Simulated API Login Success for:', email);
                        return { success: true, user: data.account.profile, email: data.account.email, uid: data.account.uid };
                    } else {
                        console.log('Simulated API Login Failed for:', email);
                        return { success: false, message: data.message || 'Invalid credentials.' };
                    }
                } catch (e) {
                    console.error('Login API call failed:', e);
                    return { success: false, message: 'Network error or server issue.' };
                }
            },
            async register(email, password, minecraftUsername, accountName, minecraftEdition) {
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/create`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': WORKER_API_KEY
                        },
                        body: JSON.stringify({ email, password, minecraftUsername, accountName, minecraftEdition })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        console.log('Simulated API Register Success for:', email);
                        return { success: true, user: data.user, email: data.email, uid: data.uid };
                    } else {
                        console.log('Simulated API Register Failed for:', email);
                        return { success: false, message: data.message || 'Registration failed.' };
                    }
                } catch (e) {
                    console.error('Register API call failed:', e);
                    return { success: false, message: 'Network error or server issue.' };
                }
            },
            async updateProfile(email, newProfileData) {
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/update-profile`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': WORKER_API_KEY
                        },
                        body: JSON.stringify({ email, newProfileData })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        console.log('Simulated API Update Profile Success for:', email);
                        return { success: true, user: data.user };
                    } else {
                        console.log('Simulated API Update Profile Failed:', email);
                        return { success: false, message: data.message || 'Profile update failed.' };
                    }
                } catch (e) {
                    console.error('Update Profile API call failed:', e);
                    return { success: false, message: 'Network error or server issue.' };
                }
            },
            async changePassword(email, currentPassword, newPassword) {
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/change-password`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': WORKER_API_KEY
                        },
                        body: JSON.stringify({ email, currentPassword, newPassword })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        console.log('Simulated API Change Password Success for:', email);
                        return { success: true, message: data.message };
                    } else {
                        console.log('Simulated API Change Password Failed:', email);
                        return { success: false, message: data.message || 'Password change failed.' };
                    }
                } catch (e) {
                    console.error('Change Password API call failed:', e);
                    return { success: false, message: 'Network error or server issue.' };
                }
            }
        };

        function handleSuccessfulAuth() {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-content-wrapper').style.display = 'block';
            console.log('Auth successful: showing main content.');
            renderProfile();
            renderPlugins(pluginsData);
            showSection('server-info-content');
            fetchServerStatus();
        }

        async function logoutUser() {
            if (currentUser) {
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/logout`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': WORKER_API_KEY
                        },
                        body: JSON.stringify({ email: currentUser.email })
                    });
                    if (!response.ok) {
                        console.error('Logout API call failed:', await response.text());
                    }
                } catch (e) {
                    console.error('Logout API call failed:', e);
                }
            }

            currentUser = null;
            userProfile = null;
            sessionStorage.removeItem('current_auth_email');
            console.log('User logged out. Clearing session.');

            document.getElementById('auth-screen').style.display = 'flex';
            document.getElementById('main-content-wrapper').style.display = 'none';
            showCustomMessage(document.getElementById('auth-message-main'), 'You have been logged out.', 'success');
            setAuthMode(false);
            toggleSidebar();
        }
