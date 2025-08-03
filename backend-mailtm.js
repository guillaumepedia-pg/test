// Voir ici : "mailtm_api_example"
// backend-mailtm.js (client-side fetch for demo)
// Real apps should use server-side proxy to protect tokens if needed.

const BASE_URL = 'https://api.mail.tm';
let tempEmail = '';
let token = '';

async function createAccountAndFetchToken() {
  try {
    const random = Math.random().toString(36).substring(2, 10);
    tempEmail = `${random}@tmpmail.net`;
    const password = 'StrongP@ssw0rd!';

    // Create account
    await fetch(`${BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: tempEmail, password })
    });

    // Authenticate
    const res = await fetch(`${BASE_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: tempEmail, password })
    });
    const data = await res.json();
    token = data.token;

    document.getElementById("temp-email-display").innerText = tempEmail;
    pollInbox();
  } catch (err) {
    console.error("Mail.tm setup failed:", err);
  }
}

async function pollInbox() {
  try {
    const res = await fetch(`${BASE_URL}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const inbox = document.getElementById("inbox-messages");
    inbox.innerHTML = data['hydra:member'].map(msg =>
      `<div><strong>${msg.from.address}</strong>: ${msg.subject}</div>`
    ).join('') || '<em>No new messages</em>';
  } catch (err) {
    console.error("Failed to fetch inbox:", err);
  }
  setTimeout(pollInbox, 5000); // refresh inbox every 5 sec
}

function generateTempEmail() {
  createAccountAndFetchToken();
}

document.addEventListener("DOMContentLoaded", createAccountAndFetchToken);
