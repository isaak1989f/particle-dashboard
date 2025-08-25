const axios = require('axios');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { username, password } = JSON.parse(event.body);

  try {
    const response = await axios.post('https://api.particle.io/oauth/token', {
      client_id: 'particle',
      client_secret: 'particle',
      expires_in: 3600,
      grant_type: 'password',
      username,
      password
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    if (error.response) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data)
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Login failed' })
      };
    }
  }
};
