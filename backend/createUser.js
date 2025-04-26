const axios = require('axios');

async function createUser(username, password, classroom) {
  try {
    const res = await axios.post('http://localhost:3000/register', {
      username,
      password,
      classroom
    });
    console.log('User created successfully:', res.data);
  } catch (err) {
    console.error('Error creating user:', err.response ? err.response.data : err.message);
  }
}

createUser('alice', 'secret', 'elite');
