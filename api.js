        // --- Simulated Cloudflare API Layer for User Data ---
        // !!! IMPORTANT: THIS IS A SIMULATION FOR LOCAL TESTING !!!
        // FOR PRODUCTION, YOU WOULD DEPLOY A CLOUDFLARE WORKER AND USE KV NAMESPACES.

        const CLOUDFLARE_KV_SIMULATION_KEY = 'cloudflare_kv_sim'; // Master key for simulated KV store

        // Helper to get the full simulated KV store
        function getSimulatedKV() {
            try {
                const data = localStorage.getItem(CLOUDFLARE_KV_SIMULATION_KEY);
                return JSON.parse(data) || {};
            } catch (e) {
                console.error("Error parsing simulated KV data from localStorage:", e);
                localStorage.removeItem(CLOUDFLARE_KV_SIMULATION_KEY); // Clear corrupted data
                return {};
            }
        }

        // Helper to put data into the simulated KV store
        function putSimulatedKV(key, value) {
            const kv = getSimulatedKV();
            kv[key] = value;
            localStorage.setItem(CLOUDFLARE_KV_SIMULATION_KEY, JSON.stringify(kv));
            console.log(`Simulated KV: Put key "${key}".`);
        }

        // Helper to get data from the simulated KV store
        function getSimulatedKVItem(key) {
            const kv = getSimulatedKV();
            const item = kv[key];
            console.log(`Simulated KV: Get key "${key}" -`, item ? 'found' : 'not found');
            return item;
        }

        // Simulated API Endpoint for User Operations
        export const simulatedCloudflareApi = {
            async login(email, password) {
                return new Promise(resolve => {
                    setTimeout(() => { // Simulate network delay
                        const userJson = getSimulatedKVItem(email.toLowerCase());
                        const user = userJson ? JSON.parse(userJson) : null;
                        if (user && user.password === password) { // In real app, hash and compare passwords securely!
                            console.log('Simulated API Login Success for:', email);
                            resolve({ success: true, user: user.profile, email: user.email, uid: user.uid });
                        } else {
                            console.log('Simulated API Login Failed for:', email);
                            resolve({ success: false, message: 'Invalid username/email or password.' });
                        }
                    }, 500);
                });
            },
            async register(email, password, minecraftUsername, accountName, minecraftEdition) { // Added minecraftEdition
                return new Promise(resolve => {
                    setTimeout(() => { // Simulate network delay
                        const lowerCaseEmail = email.toLowerCase();
                        if (getSimulatedKVItem(lowerCaseEmail)) {
                            console.log('Simulated API Register Failed: User exists', email);
                            resolve({ success: false, message: 'Account with this email already exists.' });
                            return;
                        }
                        const uid = 'user_' + btoa(email).replace(/=/g, '').substring(0, 10) + '_' + Date.now().toString().slice(-4);
                        const newUser = {
                            email: lowerCaseEmail,
                            password: password, // Still plaintext for testing
                            uid: uid,
                            profile: {
                                minecraftUsername: minecraftUsername,
                                minecraftEdition: minecraftEdition, // Store edition
                                accountId: uid,
                                accountName: accountName,
                                avatar: ''
                            }
                        };
                        putSimulatedKV(lowerCaseEmail, JSON.stringify(newUser));
                        console.log('Simulated API Register Success for:', email);
                        resolve({ success: true, user: newUser.profile, email: newUser.email, uid: newUser.uid });
                    }, 500);
                });
            },
            async updateProfile(email, newProfileData) {
                return new Promise(resolve => {
                    setTimeout(() => { // Simulate network delay
                        const userJson = getSimulatedKVItem(email.toLowerCase());
                        if (!userJson) {
                            console.log('Simulated API Update Profile Failed: User not found', email);
                            resolve({ success: false, message: 'User not found.' });
                            return;
                        }
                        const user = JSON.parse(userJson);
                        // Merge newProfileData, ensuring tickets array is not overwritten
                        user.profile = { ...user.profile, ...newProfileData };
                        putSimulatedKV(email.toLowerCase(), JSON.stringify(user));
                        console.log('Simulated API Update Profile Success for:', email);
                        resolve({ success: true, user: user.profile });
                    }, 500);
                });
            },
            async changePassword(email, currentPassword, newPassword) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const userJson = getSimulatedKVItem(email.toLowerCase());
                        if (!userJson) {
                            resolve({ success: false, message: 'User not found.' });
                            return;
                        }
                        const user = JSON.parse(userJson);
                        if (user.password !== currentPassword) { // Direct comparison for simulation
                            resolve({ success: false, message: 'Incorrect current password.' });
                            return;
                        }
                        user.password = newPassword; // Update password (still plaintext)
                        putSimulatedKV(email.toLowerCase(), JSON.stringify(user));
                        resolve({ success: true, message: 'Password updated successfully!' });
                    }, 500);
                });
            }
        };