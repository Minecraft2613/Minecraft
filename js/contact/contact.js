// --- Contact Us Form Submission ---
const contactUsForm = document.getElementById("contact-us-form");
const contactUsStatus = document.getElementById("contact-us-status");

contactUsForm.addEventListener("submit", function (e) {
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

    fetch("https://discordapp.com/api/webhooks/1383347956182290462/b1k7PVanxmP6InWfH9k4Npj7WNP9dUM-nD6xXRZGZwFOsODahyDoBnxlxNdGCCyLDetz", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: fullMessage })
    })
    .then(res => {
        if (res.ok) {
            contactUsStatus.innerText = "✅ Message sent successfully! We'll get back to you soon.";
            contactUsStatus.classList.remove('error');
            contactUsForm.reset();
        } else {
            contactUsStatus.innerText = "❌ Failed to send. Try again later.";
            contactUsStatus.classList.add('error');
        }
    })
    .catch(error => {
        console.error("Contact form error:", error);
        contactUsStatus.innerText = "❌ Error sending message.";
        contactUsStatus.classList.add('error');
    });
});
