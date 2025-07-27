// --- Global Configuration ---
        const CLOUDFLARE_WORKER_BASE_URL = 'https://minecraft1.1987sakshamsingh.workers.dev';

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
