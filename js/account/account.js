let currentUser = null;
        let userProfile = null;

        const simulatedCloudflareApi = {
            async login(identifier, password) { // Changed email to identifier as per worker
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ identifier, password })
                    });
                    const data = await response.json();
                    if (response.ok && data.message === "Login successful") { // Check message for success
                        console.log('Simulated API Login Success for:', identifier);
                        currentUser = data.account; // Store the full account object
                        userProfile = data.account; // userProfile can also be the full account
                        return { success: true, user: data.account, email: data.account.email, uid: data.account.accountId };
                    } else {
                        console.log('Simulated API Login Failed for:', identifier);
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
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password, minecraftUsername, accountName, minecraftEdition })
                    });
                    const data = await response.json();
                    if (response.ok && data.message === "Account created successfully") { // Check message for success
                        console.log('Simulated API Register Success for:', email);
                        return { success: true, accountId: data.accountId, message: data.message };
                    } else {
                        console.log('Simulated API Register Failed for:', email);
                        return { success: false, message: data.message || 'Registration failed.' };
                    }
                } catch (e) {
                    console.error('Register API call failed:', e);
                    return { success: false, message: 'Network error or server issue.' };
                }
            },
            async updateProfile(accountId, updatedSettings) { // Changed email to accountId, newProfileData to updatedSettings
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/settings/update`, { // Changed endpoint
                        method: 'POST', // Changed to POST as per worker
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ accountId, updatedSettings }) // Send accountId and updatedSettings
                    });
                    const data = await response.json();
                    if (response.ok && data.message === "Settings updated successfully") { // Check message for success
                        console.log('Simulated API Update Profile Success for:', accountId);
                        currentUser = data.updatedAccount; // Update currentUser with the latest data
                        userProfile = data.updatedAccount; // Update userProfile
                        return { success: true, user: data.updatedAccount };
                    } else {
                        console.log('Simulated API Update Profile Failed:', accountId);
                        return { success: false, message: data.message || 'Profile update failed.' };
                    }
                } catch (e) {
                    console.error('Update Profile API call failed:', e);
                    return { success: false, message: 'Network error or server issue.' };
                }
            },
            async changePassword(email, currentPassword, newPassword) {
                // This endpoint is not yet implemented in the worker with the new structure.
                // It would need to fetch the account, update passwordHash, and save.
                console.warn("Change password functionality not yet implemented in worker.");
                return { success: false, message: "Functionality not implemented." };
            },
            async getAccountDetails(accountId) {
                try {
                    const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/account/details?accountId=${accountId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        return { success: true, account: data };
                    } else {
                        return { success: false, message: data.message || 'Failed to fetch account details.' };
                    }
                } catch (e) {
                    console.error('Get Account Details API call failed:', e);
                    return { success: false, message: 'Network error or server issue.' };
                }
            }
        };

        function handleSuccessfulAuth() {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-content-wrapper').style.display = 'block';
            console.log('Auth successful: showing main content.');
            // renderProfile(); // This function will need to be updated to use currentUser.settings and currentUser.theme
            // renderPlugins(pluginsData);
            // showSection('server-info-content');
            // fetchServerStatus();
        }

        async function logoutUser() {
            if (currentUser) {
                // The worker does not have a /account/logout endpoint yet.
                // If implemented, it would update lastLogout and logoutHistory in account.json
                console.warn("Logout functionality not yet implemented in worker.");
            }

            currentUser = null;
            userProfile = null;
            sessionStorage.removeItem('current_auth_email');
            sessionStorage.removeItem('current_auth_accountId'); // Also clear accountId
            console.log('User logged out. Clearing session.');

            document.getElementById('auth-screen').style.display = 'flex';
            document.getElementById('main-content-wrapper').style.display = 'none';
            showCustomMessage(document.getElementById('auth-message-main'), 'You have been logged out.', 'success');
            // setAuthMode(false);
            // toggleSidebar();
        }