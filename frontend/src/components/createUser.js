export async function createUser(username, password, classroom) {
  try {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, classroom }),
    });

    const data = await res.text(); // You can parse as JSON if needed

    if (!res.ok) {
      throw new Error(data);
    }

    return data; // Return success message or any response from the backend
  } catch (error) {
    throw new Error('Error creating account: ' + error.message);
  }
}
