document.addEventListener('DOMContentLoaded', () => {
    const contactUsForm = document.getElementById("contact-us-form");
    const contactUsStatus = document.getElementById("contact-us-status");

    contactUsForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const minecraftUsername = document.getElementById("contact-minecraft-username").value.trim();
        const discordId = document.getElementById("contact-discord-id").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        if (!minecraftUsername || !discordId || !message) {
            contactUsStatus.innerText = "⚠️ Please fill in all required fields.";
            contactUsStatus.classList.add('error');
            return;
        }

        const fullMessage = `📧 **NEW CONTACT US MESSAGE** 📧\n**Submitted By Email:** ${currentUser ? currentUser.email : 'Not Logged In'} (UID: ${currentUser ? currentUser.uid : 'N/A'})\n**Minecraft User:** ${minecraftUsername}\n**Discord ID:** ${discordId}\n**Message:**\n${message}`;

        try {
            const response = await fetch(`${CLOUDFLARE_WORKER_BASE_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth-Token": WORKER_API_KEY
                },
                body: JSON.stringify({
                    username: minecraftUsername,
                    discordId: discordId,
                    message: message,
                    fullMessage: fullMessage // Send the formatted message for logging/storage
                })
            });

            if (response.ok) {
                contactUsStatus.innerText = "✅ Message sent successfully! We'll get back to you soon.";
                contactUsStatus.classList.remove('error');
                contactUsForm.reset();
            } else {
                const errorData = await response.json();
                contactUsStatus.innerText = `❌ Failed to send: ${errorData.message || response.statusText}.`;
                contactUsStatus.classList.add('error');
            }
        } catch (error) {
            console.error("Contact form error:", error);
            contactUsStatus.innerText = "❌ Error sending message.";
            contactUsStatus.classList.add('error');
        }
    });
});