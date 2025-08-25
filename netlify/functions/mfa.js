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

  const { mfa_token, otp } = payload;
  if (!mfa_token || !otp) {
    return { statusCode: 400, body: "Missing mfa_token or otp" };
  }

  try {
    // Particle MFA exchange (form-encoded)
    const form = new URLSearchParams({
      client_id: "particle",
      client_secret: "particle",
      grant_type: "urn:custom:mfa-otp",
      mfa_token,
      otp
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
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data),
        headers: { "Content-Type": "application/json" }
      };
    }
    return { statusCode: 500, body: JSON.stringify({ error: "MFA failed" }) };
  }
};
