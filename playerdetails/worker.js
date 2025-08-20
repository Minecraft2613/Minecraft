

let accData = [];
let polData = { username: 'Police', password: '543213' };
let detailsData = {};
let msgData = [];
let notifications = [];

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
    const url = new URL(request.url)
    const path = url.pathname

    if (path === '/api/signup' && request.method === 'POST') {
        return handleSignup(request)
    } else if (path === '/api/login' && request.method === 'POST') {
        return handleLogin(request)
    } else if (path === '/api/data' && request.method === 'GET') {
        return handleData(request)
    } else if (path === '/api/chat' && request.method === 'POST') {
        return handleChat(request)
    } else if (path === '/api/misinformation' && request.method === 'POST') {
        return handleMisinformation(request)
    } else if (path.startsWith('/web/')) {
        return handleStatic(request)
    } else {
        return new Response('Not Found', { status: 404 })
    }
}


const ENCRYPTION_KEY = 'YOUR_ENCRYPTION_KEY'; // Replace with a strong, securely managed key

async function handleSignup(request) {
    const { username, password, real_name, player_type, ...playerData } = await request.json();

    // Encrypt player data
    const encryptedPlayerData = await encrypt(JSON.stringify({ real_name, player_type, ...playerData }));

    // Store basic account info
    accData.push({ username, password }); // In a real app, hash the password

    // Store detailed player data
    detailsData[username] = encryptedPlayerData;

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}

async function handleMisinformation(request) {
    const { username } = await request.json();
    notifications.push({ type: 'misinformation', username, timestamp: new Date().toISOString() });
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
}

async function encrypt(data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(ENCRYPTION_KEY),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
    );
    return { iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) };
}



async function handleLogin(request) {
    const { username, password } = await request.json();

    if (username === polData.username && password === polData.password) {
        return new Response(JSON.stringify({ success: true, role: 'police' }), { headers: { 'Content-Type': 'application/json' } });
    }

    const user = accData.find(u => u.username === username && u.password === password);

    if (user) {
        return new Response(JSON.stringify({ success: true, role: 'player' }), { headers: { 'Content-Type': 'application/json' } });
    } else {
        return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
}



async function handleData(request) {
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    const role = url.searchParams.get('role');

    if (role === 'police') {
        const decryptedData = {};
        for (const user in detailsData) {
            decryptedData[user] = JSON.parse(await decrypt(detailsData[user]));
        }
        return new Response(JSON.stringify({ players: decryptedData, notifications: notifications }), { headers: { 'Content-Type': 'application/json' } });
    } else if (role === 'player' && username) {
        if (detailsData[username]) {
            const decryptedData = JSON.parse(await decrypt(detailsData[username]));
            return new Response(JSON.stringify(decryptedData), { headers: { 'Content-Type': 'application/json' } });
        } else {
            return new Response(JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
        }
    } else {
        return new Response('Unauthorized', { status: 401 });
    }
}

async function decrypt(encryptedData) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(ENCRYPTION_KEY),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
        key,
        new Uint8Array(encryptedData.encrypted)
    );
    return new TextDecoder().decode(decrypted);
}



async function handleChat(request) {
    if (request.method === 'POST') {
        const { username, message } = await request.json();
        msgData.push({ username, message, timestamp: new Date().toISOString() });
        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
    } else if (request.method === 'GET') {
        return new Response(JSON.stringify(msgData), { headers: { 'Content-Type': 'application/json' } });
    }
}


async function handleStatic(request) {
    const url = new URL(request.url)
    const path = url.pathname

    switch (path) {
        case '/web/index.html':
            return new Response(INDEX_HTML, { headers: { 'Content-Type': 'text/html' } });
        case '/web/signup.html':
            return new Response(SIGNUP_HTML, { headers: { 'Content-Type': 'text/html' } });
        case '/web/dashboard.html':
            return new Response(DASHBOARD_HTML, { headers: { 'Content-Type': 'text/html' } });
        case '/web/style.css':
            return new Response(STYLE_CSS, { headers: { 'Content-Type': 'text/css' } });
        case '/web/script.js':
            return new Response(SCRIPT_JS, { headers: { 'Content-Type': 'application/javascript' } });
        default:
            return new Response('Not Found', { status: 404 });
    }
}

const INDEX_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="login-container">
            <h2>Login</h2>
            <form id="login-form">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="signup.html">Sign up</a></p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
`;

const SIGNUP_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="signup-container">
            <h2>Sign Up</h2>
            <form id="signup-form">
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="input-group">
                    <label for="mobile">Mobile Number</label>
                    <input type="text" id="mobile" name="mobile">
                </div>
                <div class="input-group">
                    <label for="java">Java Username</label>
                    <input type="text" id="java" name="java">
                </div>
                <div class="input-group">
                    <label for="bedrock">Bedrock Username</label>
                    <input type="text" id="bedrock" name="bedrock">
                </div>
                <div class="input-group">
                    <label for="instagram">Instagram Username</label>
                    <input type="text" id="instagram" name="instagram">
                </div>
                <div class="input-group">
                    <label for="whatsapp">WhatsApp Number</label>
                    <input type="text" id="whatsapp" name="whatsapp">
                </div>
                <div class="input-group">
                    <label for="discord">Discord Username</label>
                    <input type="text" id="discord" name="discord">
                </div>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email">
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <a href="index.html">Login</a></p>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
`;

const DASHBOARD_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="dashboard-container">
            <h2>Player Data</h2>
            <div id="player-data-container"></div>

            <div id="chat-container">
                <h3>Chat</h3>
                <div id="chat-messages"></div>
                <form id="chat-form">
                    <input type="text" id="chat-input" placeholder="Type a message...">
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
`;

const STYLE_CSS = `
body {
    font-family: sans-serif;
    background-color: #f0f2f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    width: 100%;
    max-width: 400px;
}

.login-container,
.signup-container,
.dashboard-container {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 1.5rem;
}

.input-group {
    margin-bottom: 1rem;
}

.input-group label {
    display: block;
    margin-bottom: 0.5rem;
}

.input-group input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background-color: #0056b3;
}

p {
    text-align: center;
    margin-top: 1rem;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

#player-data-container {
    margin-bottom: 2rem;
}

#chat-container {
    border-top: 1px solid #ccc;
    padding-top: 1rem;
}

#chat-messages {
    height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 0.5rem;
    margin-bottom: 1rem;
}
`;

const SCRIPT_JS = `
document.addEventListener('DOMContentLoaded', () => {
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
        for (const user in data) {
            const div = document.createElement('div');
            div.innerHTML = `<h3>${user}</h3><pre>${JSON.stringify(data[user], null, 2)}</pre>`;
            container.appendChild(div);
        }
    } else {
        const div = document.createElement('div');
        div.innerHTML = `<h3>My Data</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
        container.appendChild(div);
    }
}

async function loadChat() {
    const response = await fetch('/api/chat', { method: 'GET' });
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

