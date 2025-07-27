        // --- Custom Message Box (Replaces alert()) ---
        const messageBoxOverlay = document.getElementById('message-box-overlay');
        const messageBoxTitle = document.getElementById('message-box-title');
        const messageBoxContent = document.getElementById('message-box-content');

        // Function to show custom alert that auto-dismisses
        export function showCustomAlert(title, message, duration = 3000) { // Default 3 seconds
            messageBoxTitle.textContent = title;
            messageBoxContent.textContent = message;
            messageBoxOverlay.classList.add('active');

            setTimeout(() => {
                messageBoxOverlay.classList.remove('active');
            }, duration);
        }

        // Intercept standard alert calls to use custom box (for development/testing)
        const originalAlert = window.alert;
        window.alert = function(message) {
            showCustomAlert('Alert', message);
        };

        // --- Loading Screen Logic ---
        export function handleDOMContentLoaded() {
            const loadingScreen = document.getElementById('loading-screen');
            console.log('DOMContentLoaded: Hiding loading screen after 1.5s.');
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                loadingScreen.addEventListener('transitionend', () => {
                    loadingScreen.remove(); // Remove from DOM after animation
                    console.log('Loading screen removed.');
                });
            }, 1500); // Display loading for 1.5 seconds
        }


        // Simple UID generator (for demo purposes)
        export function generateUID(email) {
            return 'user_' + btoa(email).replace(/=/g, '').substring(0, 10) + '_' + Date.now().toString().slice(-4);
        }

        export function showCustomMessage(element, message, type) {
            element.textContent = message;
            element.className = `custom-message ${type}`;
        }

        export function copyToClipboard(elementId) {
            const text = document.getElementById(elementId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                showCustomAlert('Copied!', `Copied to clipboard: ${text}`);
            }, (err) => {
                showCustomAlert('Error', 'Failed to copy text.');
                console.error('Could not copy text: ', err);
            });
        }

        export function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('main-content-wrapper');
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('sidebar-open');
        }

        export function showSection(sectionId) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');

            document.querySelectorAll('#sidebar nav a').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === sectionId) {
                    link.classList.add('active');
                }
            });
        }

        export function toggleProfileDropdown() {
            const dropdown = document.getElementById('profile-dropdown-menu');
            dropdown.classList.toggle('active');
        }
