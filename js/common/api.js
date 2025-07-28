// ====================================================================================
//  Frontend API Layer
// ====================================================================================
// This file abstracts the communication between the frontend and the Cloudflare
// worker. Instead of simulating the API with localStorage, it now makes real
// HTTP requests to the deployed worker endpoints.
// ====================================================================================

// IMPORTANT: Replace this with your actual deployed Cloudflare Worker URL
const WORKER_URL = 'https://minecraft1.1987sakshamsingh.workers.dev';

const simulatedCloudflareApi = {
  /**
   * Registers a new user by sending their details to the worker.
   */
  async register(email, password, minecraftUsername, accountName, minecraftEdition) {
    const response = await fetch(`${WORKER_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, minecraftUsername, accountName, minecraftEdition }),
    });
    return response.json();
  },

  /**
   * Logs in a user by sending their credentials to the worker.
   */
  async login(email, password) {
    const response = await fetch(`${WORKER_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  /**
   * Fetches a user's profile from the worker.
   */
  async getProfile(email) {
    const response = await fetch(`${WORKER_URL}/api/profile/${email}`);
    return response.json();
  },

  /**
   * Updates a user's profile by sending the new data to the worker.
   */
  async updateProfile(email, newProfileData) {
    const response = await fetch(`${WORKER_URL}/api/profile/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfileData),
    });
    return response.json();
  },

  /**
   * Updates a user's theme settings.
   */
  async updateTheme(userId, themeData) {
    const response = await fetch(`${WORKER_URL}/api/theme/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeData),
    });
    return response.json();
  }
};