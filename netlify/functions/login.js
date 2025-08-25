const axios = require("axios");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { username, password } = payload;
  if (!username || !password) {
    return { statusCode: 400, body: "Missing username or password" };
  }

  try {
    // Particle OAuth prefers form-encoded
    const form = new URLSearchParams({
      client_id: "particle",
      client_secret: "particle",
      grant_type: "password",
      username,
      password,
      // optional: token lifetime (seconds)
      // expires_in: "3600"
    });

    const response = await axios.post(
      "https://api.particle.io/oauth/token",
      form.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    if (error.response) {
      // If MFA is required, Particle returns 403 with mfa_token
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data),
        headers: { "Content-Type": "application/json" }
      };
    }
    return { statusCode: 500, body: JSON.stringify({ error: "Login failed" }) };
  }
};
