// --- Loading Screen Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    console.log('DOMContentLoaded: Hiding loading screen after 1.5s.');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        loadingScreen.addEventListener('transitionend', () => {
            loadingScreen.remove(); // Remove from DOM after animation
            console.log('Loading screen removed.');
        });
    }, 1500); // Display loading for 1.5 seconds
});

// --- Custom Message Box (Replaces alert()) ---
const messageBoxOverlay = document.getElementById('message-box-overlay');
const messageBoxTitle = document.getElementById('message-box-title');
const messageBoxContent = document.getElementById('message-box-content');

// Function to show custom alert that auto-dismisses
function showCustomAlert(title, message, duration = 3000) { // Default 3 seconds
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

// --- UI Navigation & Sidebar Logic ---
const SIDEBAR = document.getElementById('sidebar');
const MAIN_CONTENT_WRAPPER = document.getElementById('main-content-wrapper');
const OVERLAY = document.querySelector('.overlay');
let SIDEBAR_NAV_LINKS;

document.addEventListener('DOMContentLoaded', () => {
    SIDEBAR_NAV_LINKS = document.querySelectorAll('#sidebar nav a');

    SIDEBAR_NAV_LINKS.forEach(link => {
        // Check if the link should open an external URL (like Discord/Instagram)
        if (link.href && link.target === '_blank') {
            link.addEventListener('click', (e) => {
                // Do nothing, let the browser handle the target="_blank"
            });
        } else if (link.dataset.section) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(link.dataset.section);
                toggleSidebar(); // Close sidebar after navigation
            });
        }
    });
});
const HOMEPAGE_NAV_SECTION = document.getElementById('homepage-nav-section'); // The section with the 3 main buttons
const DYNAMIC_CONTENT_AREA = document.getElementById('dynamic-content-area'); // The container for content below buttons
const ALL_CONTENT_SECTIONS = document.querySelectorAll('#dynamic-content-area > .content-section'); // All sections that live *inside* dynamic-content-area

function toggleSidebar() {
    SIDEBAR.classList.toggle('open');
    MAIN_CONTENT_WRAPPER.classList.toggle('sidebar-open');
    OVERLAY.classList.toggle('active');
}

// Function to show a specific content section and hide others
function showSection(sectionId) {
    ALL_CONTENT_SECTIONS.forEach(section => {
        section.classList.remove('active');
    });

    // Adjust homepage nav section visibility based on the type of content
    if (['server-info-content', 'plugins-content', 'how-to-play-content'].includes(sectionId)) {
        HOMEPAGE_NAV_SECTION.style.display = 'flex'; // Show the main buttons
        document.getElementById(sectionId).classList.add('active'); // Show the requested content below
    } else {
        HOMEPAGE_NAV_SECTION.style.display = 'none'; // Hide the main buttons
        document.getElementById(sectionId).classList.add('active'); // Show the requested content
    }

    // Update active class in sidebar nav
    SIDEBAR_NAV_LINKS.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
        // Special case for 'Home' in sidebar: activate if any of the main 3 are active
        if (link.dataset.section === "server-info-content" && ['server-info-content', 'plugins-content', 'how-to-play-content'].includes(sectionId)) {
            link.classList.add('active');
        }
    });
}

// --- Custom Message Display for small inline messages (not the full modal alert) ---
function showCustomMessage(element, message, type) {
    let msgElement = null;
    // Find the closest parent that can contain a message, or create one
    const closestForm = element.closest('form');
    if (closestForm) {
        msgElement = closestForm.querySelector('.custom-message');
        if (!msgElement) {
            msgElement = document.createElement('p');
            msgElement.classList.add('custom-message');
            closestForm.appendChild(msgElement);
        }
    } else {
        // For existing message areas like #auth-message-main or section titles
        if (element.tagName === 'H2' || element.tagName === 'P') {
            msgElement = element;
        } else {
             // Fallback, append to body or a general area if specific parent not found
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
        msgElement.className = `custom-message ${type}`; // 'error' or 'success'
        setTimeout(() => {
            msgElement.textContent = '';
            msgElement.classList.remove('error', 'success');
            if (msgElement.classList.contains('temp')) {
                msgElement.remove(); // Remove temporary messages
            }
        }, 3000); // Clear message after 3 seconds
    }
}

// Function to enforce bedrock username format
window.forceDotPrefix = function(event) {
    const input = event.target;
    // Assuming AUTH_PLATFORM_SELECT is globally accessible or passed
    // For now, let's assume it's accessible via document.getElementById in this global function
    const AUTH_PLATFORM_SELECT = document.getElementById('auth-platform-select');
    if (AUTH_PLATFORM_SELECT && AUTH_PLATFORM_SELECT.value === 'bedrock' && !input.value.startsWith('.')) {
        input.value = '.' + input.value.replace(/ /g, '_'); // Also replace spaces with underscores
    }
};

// Function to enforce bedrock username format
window.forceDotPrefix = function(event) {
    const input = event.target;
    // Assuming AUTH_PLATFORM_SELECT is globally accessible or passed
    // For now, let's assume it's accessible via document.getElementById in this global function
    const AUTH_PLATFORM_SELECT = document.getElementById('auth-platform-select');
    if (AUTH_PLATFORM_SELECT && AUTH_PLATFORM_SELECT.value === 'bedrock' && !input.value.startsWith('.')) {
        input.value = '.' + input.value.replace(/ /g, '_'); // Also replace spaces with underscores
    }
};

window.setAuthMode = function(mode) {
    isCreateMode = mode;
    MAIN_AUTH_MESSAGE_ELEM.textContent = ''; // Clear messages

    // Hide all create-account-specific fields first
    AUTH_MINECRAFT_USERNAME_INPUT.style.display = 'none';
    AUTH_ACCOUNT_NAME_INPUT.style.display = 'none';
    AUTH_PLATFORM_SELECT.style.display = 'none';
    document.querySelector('label[for="auth-platform-select"]').style.display = 'none'; // Hide label too
    RULES_CHECKBOX_CONTAINER.style.display = 'none';
    AUTH_MINECRAFT_USERNAME_INPUT.removeEventListener('input', forceDotPrefix); // Remove listener when not in bedrock create mode


    if (isCreateMode) {
        AUTH_WELCOME_MESSAGE.textContent = 'Thanks for Joining!';
        AUTH_MINECRAFT_USERNAME_INPUT.style.display = 'block';
        AUTH_ACCOUNT_NAME_INPUT.style.display = 'block';
        AUTH_PLATFORM_SELECT.style.display = 'block';
        document.querySelector('label[for="auth-platform-select"]').style.display = 'block';
        RULES_CHECKBOX_CONTAINER.style.display = 'flex'; // Show rules checkbox
        MAIN_AUTH_SUBMIT_BTN.textContent = 'Register Account';
        TOGGLE_AUTH_MODE_BTN.textContent = 'Have an account? Login'; // Changed text
    } else {
        AUTH_WELCOME_MESSAGE.textContent = 'Welcome Back!';
        MAIN_AUTH_SUBMIT_BTN.textContent = 'Login';
        TOGGLE_AUTH_MODE_BTN.textContent = 'Don\'t have an account? Create one'; // Changed text
    }
    // Clear inputs when switching modes
    MAIN_AUTH_EMAIL_INPUT.value = '';
    MAIN_AUTH_PASSWORD_INPUT.value = '';
    AUTH_MINECRAFT_USERNAME_INPUT.value = '';
    AUTH_ACCOUNT_NAME_INPUT.value = '';
    AUTH_PLATFORM_SELECT.value = ''; // Reset platform select
    AGREE_RULES_CHECKBOX.checked = false;
}
