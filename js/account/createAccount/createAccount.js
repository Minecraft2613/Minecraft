let isCreateMode = false;

function setAuthMode(mode) {
    isCreateMode = mode;
    document.getElementById('auth-message-main').textContent = '';

    const minecraftUsernameInput = document.getElementById('auth-minecraft-username-input');
    const accountNameInput = document.getElementById('auth-account-name-input');
    const platformSelect = document.getElementById('auth-platform-select');
    const rulesCheckboxContainer = document.getElementById('rules-checkbox-container');

    minecraftUsernameInput.style.display = 'none';
    accountNameInput.style.display = 'none';
    platformSelect.style.display = 'none';
    document.querySelector('label[for="auth-platform-select"]').style.display = 'none';
    rulesCheckboxContainer.style.display = 'none';
    minecraftUsernameInput.removeEventListener('input', forceDotPrefix);

    if (isCreateMode) {
        document.getElementById('auth-welcome-message').textContent = 'Thanks for Joining!';
        minecraftUsernameInput.style.display = 'block';
        accountNameInput.style.display = 'block';
        platformSelect.style.display = 'block';
        document.querySelector('label[for="auth-platform-select"]').style.display = 'block';
        rulesCheckboxContainer.style.display = 'flex';
        document.getElementById('main-auth-submit-btn').textContent = 'Register Account';
        document.getElementById('toggle-auth-mode-btn').textContent = 'Have an account? Login';
    } else {
        document.getElementById('auth-welcome-message').textContent = 'Welcome Back!';
        document.getElementById('main-auth-submit-btn').textContent = 'Login';
        document.getElementById('toggle-auth-mode-btn').textContent = "Don't have an account? Create one";
    }

    document.getElementById('auth-email-input').value = '';
    document.getElementById('auth-password-input').value = '';
    minecraftUsernameInput.value = '';
    accountNameInput.value = '';
    platformSelect.value = '';
    document.getElementById('agree-rules-checkbox').checked = false;
}

function forceDotPrefix() {
    const minecraftUsernameInput = document.getElementById('auth-minecraft-username-input');
    if (document.getElementById('auth-platform-select').value === 'bedrock' && !minecraftUsernameInput.value.startsWith('.')) {
        minecraftUsernameInput.value = '.' + minecraftUsernameInput.value.replace(/^\.+/, '');
    }
}

document.getElementById('auth-platform-select').addEventListener('change', () => {
    if (document.getElementById('auth-platform-select').value === 'bedrock') {
        document.getElementById('auth-minecraft-username-input').value = '.';
        document.getElementById('auth-minecraft-username-input').addEventListener('input', forceDotPrefix);
    } else {
        document.getElementById('auth-minecraft-username-input').removeEventListener('input', forceDotPrefix);
        document.getElementById('auth-minecraft-username-input').value = '';
    }
});

document.getElementById('toggle-auth-mode-btn').addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode(!isCreateMode);
});