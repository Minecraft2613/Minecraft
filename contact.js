        import { showCustomMessage } from './utils.js';

        const CONTACT_US_FORM = document.getElementById('contact-us-form');
        const CONTACT_US_STATUS_ELEM = document.getElementById('contact-us-status');

        CONTACT_US_FORM.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('contact-minecraft-username').value;
            const discordId = document.getElementById('contact-discord-id').value;
            const message = document.getElementById('contact-message').value;

            if (username && discordId && message) {
                // In a real application, you would send this to a backend or a service like Formspree.
                showCustomMessage(CONTACT_US_STATUS_ELEM, 'Message sent successfully! We will get back to you on Discord.', 'success');
                CONTACT_US_FORM.reset();
            } else {
                showCustomMessage(CONTACT_US_STATUS_ELEM, 'Please fill out all fields.', 'error');
            }
        });
