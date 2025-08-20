
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role');
    if (role === 'police') {
        const policeControls = document.getElementById('police-signup-controls');
        if (policeControls) {
            policeControls.style.display = 'block';
        }
    }

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const chatForm = document.getElementById('chat-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('username', username);
                localStorage.setItem('role', data.role);
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                alert('Signup successful! Please log in.');
                window.location.href = 'index.html';
            } else {
                alert('Signup failed.');
            }
        });
    }

    if (chatForm) {
        const username = localStorage.getItem('username');
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = e.target['chat-input'].value;

            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, message })
            });

            e.target['chat-input'].value = '';
            loadChat();
        });

        loadPlayerData();
        loadChat();
        setInterval(loadChat, 5000); // Refresh chat every 5 seconds
    }
});

async function loadPlayerData() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const response = await fetch(`/api/data?username=${username}&role=${role}`);
    const data = await response.json();

    const container = document.getElementById('player-data-container');
    container.innerHTML = '';

    if (role === 'police') {
        document.getElementById('police-controls').style.display = 'flex';
        const players = data.players;
        for (const user in players) {
            const div = document.createElement('div');
            div.innerHTML = `<h3>${user}</h3><pre>${JSON.stringify(players[user], null, 2)}</pre>`;
            container.appendChild(div);
        }

        const notificationBell = document.getElementById('notification-bell');
        if (data.notifications && data.notifications.length > 0) {
            notificationBell.innerHTML = `&#128276; <span style="color: red;">${data.notifications.length}</span>`;
            notificationBell.addEventListener('click', () => {
                let notificationContent = '';
                for(const notification of data.notifications) {
                    notificationContent += `${notification.type} from ${notification.username} at ${new Date(notification.timestamp).toLocaleString()}\n`;
                }
                alert(notificationContent);
            });
        }

    } else {
        document.getElementById('misinformation-container').style.display = 'block';
        const div = document.createElement('div');
        div.innerHTML = `<h3>My Data</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
        container.appendChild(div);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const raiseMisinfoBtn = document.getElementById('raise-misinfo-btn');
    if(raiseMisinfoBtn) {
        raiseMisinfoBtn.addEventListener('click', async () => {
            const username = localStorage.getItem('username');
            await fetch('/api/misinformation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            alert('Misinformation reported.');
        });
    }

    const registerPlayerBtn = document.getElementById('register-player-btn');
    if(registerPlayerBtn) {
        registerPlayerBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }

    const viewPlayersBtn = document.getElementById('view-players-btn');
    if(viewPlayersBtn) {
        viewPlayersBtn.addEventListener('click', () => {
            loadPlayerData();
        });
    }
});

async function loadChat() {
    const response = await fetch('/api/chat');
    const data = await response.json();

    const container = document.getElementById('chat-messages');
    container.innerHTML = '';

    for (const message of data) {
        const div = document.createElement('div');
        div.textContent = `[${new Date(message.timestamp).toLocaleTimeString()}] ${message.username}: ${message.message}`;
        container.appendChild(div);
    }

    container.scrollTop = container.scrollHeight;
}
