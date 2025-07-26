        // --- Global Configuration ---
        const CLOUDFLARE_WORKER_BASE_URL = 'https://minecraft1.1987sakshamsingh.workers.dev';
        const WORKER_API_KEY = 'd47b4af7-2b66-4e82-b9ac-1dce11b3872b';

        // --- Custom Message Box (Replaces alert()) ---
        const messageBoxOverlay = document.getElementById('message-box-overlay');
        const messageBoxTitle = document.getElementById('message-box-title');
        const messageBoxContent = document.getElementById('message-box-content');

        function showCustomAlert(title, message, duration = 3000) {
            messageBoxTitle.textContent = title;
            messageBoxContent.textContent = message;
            messageBoxOverlay.classList.add('active');
            setTimeout(() => {
                messageBoxOverlay.classList.remove('active');
            }, duration);
        }

        const originalAlert = window.alert;
        window.alert = function(message) {
            showCustomAlert('Alert', message);
        };

        // Helper to get the full simulated KV store
        const CLOUDFLARE_KV_SIMULATION_KEY = 'cloudflare_kv_sim';

        function getSimulatedKV() {
            try {
                const data = localStorage.getItem(CLOUDFLARE_KV_SIMULATION_KEY);
                return JSON.parse(data) || {};
            } catch (e) {
                console.error("Error parsing simulated KV data from localStorage:", e);
                localStorage.removeItem(CLOUDFLARE_KV_SIMULATION_KEY);
                return {};
            }
        }

        function putSimulatedKV(key, value) {
            const kv = getSimulatedKV();
            kv[key] = value;
            localStorage.setItem(CLOUDFLARE_KV_SIMULATION_KEY, JSON.stringify(kv));
            console.log(`Simulated KV: Put key "${key}".`);
        }

        function getSimulatedKVItem(key) {
            const kv = getSimulatedKV();
            const item = kv[key];
            console.log(`Simulated KV: Get key "${key}" -`, item ? 'found' : 'not found');
            return item;
        }

        // Simple UID generator (for demo purposes)
        function generateUID(email) {
            return 'user_' + btoa(email).replace(/=/g, '').substring(0, 10) + '_' + Date.now().toString().slice(-4);
        }

        // --- Custom Message Display for small inline messages (not the full modal alert) ---
        function showCustomMessage(element, message, type) {
            let msgElement = null;
            const closestForm = element.closest('form');
            if (closestForm) {
                msgElement = closestForm.querySelector('.custom-message');
                if (!msgElement) {
                    msgElement = document.createElement('p');
                    msgElement.classList.add('custom-message');
                    closestForm.appendChild(msgElement);
                }
            } else {
                if (element.tagName === 'H2' || element.tagName === 'P') {
                    msgElement = element;
                } else {
                    msgElement = document.querySelector('#dynamic-content-area') || document.body;
                    const existingTempMsg = msgElement.querySelector('.custom-message.temp');
                    if(existingTempMsg) existingTempMsg.remove();
                    const newTempMsg = document.createElement('p');
                    newTempMsg.classList.add('custom-message', 'temp');
                    msgElement.appendChild(newTempMsg);
                    msgElement = newTempMsg;
                }
            }

            if (msgElement) {
                msgElement.textContent = message;
                msgElement.className = `custom-message ${type}`;
                setTimeout(() => {
                    msgElement.textContent = '';
                    msgElement.classList.remove('error', 'success');
                    if (msgElement.classList.contains('temp')) {
                        msgElement.remove();
                    }
                }, 3000);
            }
        }

        // --- Copy-to-Clipboard ---
        function copyToClipboard(id) {
            const text = document.getElementById(id).innerText;
            navigator.clipboard.writeText(text).then(() => {
                showCustomAlert('Copied!', 'Text copied to clipboard: ' + text);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                showCustomAlert('Error', 'Failed to copy text.');
            });
        }

        // --- UI Navigation & Sidebar Logic ---
        const SIDEBAR = document.getElementById('sidebar');
        const MAIN_CONTENT_WRAPPER = document.getElementById('main-content-wrapper');
        const OVERLAY = document.querySelector('.overlay');
        const SIDEBAR_NAV_LINKS = document.querySelectorAll('#sidebar nav a');
        const HOMEPAGE_NAV_SECTION = document.getElementById('homepage-nav-section');
        const ALL_CONTENT_SECTIONS = document.querySelectorAll('#dynamic-content-area > .content-section');

        function toggleSidebar() {
            SIDEBAR.classList.toggle('open');
            MAIN_CONTENT_WRAPPER.classList.toggle('sidebar-open');
            OVERLAY.classList.toggle('active');
        }

        function showSection(sectionId) {
            ALL_CONTENT_SECTIONS.forEach(section => {
                section.classList.remove('active');
            });

            if (['server-info-content', 'plugins-content', 'how-to-play-content'].includes(sectionId)) {
                HOMEPAGE_NAV_SECTION.style.display = 'flex';
                document.getElementById(sectionId).classList.add('active');
            } else {
                HOMEPAGE_NAV_SECTION.style.display = 'none';
                document.getElementById(sectionId).classList.add('active');
            }

            SIDEBAR_NAV_LINKS.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === sectionId) {
                    link.classList.add('active');
                }
                if (link.dataset.section === "server-info-content" && ['server-info-content', 'plugins-content', 'how-to-play-content'].includes(sectionId)) {
                    link.classList.add('active');
                }
            });
        }

        let isCreateMode = false;

        // --- JSON File Read/Write Functions (via Cloudflare Worker) ---
        async function readJsonFile(filePath) {
            try {
                const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/${filePath}`, {
                    headers: {
                        'X-Auth-Token': WORKER_API_KEY
                    }
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        return null; // File not found
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (e) {
                console.error(`Error reading ${filePath}:`, e);
                return null;
            }
        }

        async function writeJsonFile(filePath, data) {
            try {
                const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/${filePath}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Token': WORKER_API_KEY
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to write to ${filePath}: ${response.statusText} - ${errorText}`);
                }
                console.log(`Successfully wrote to ${filePath}`);
                return true;
            } catch (e) {
                console.error(`Error writing ${filePath}:`, e);
                return false;
            }
        }
