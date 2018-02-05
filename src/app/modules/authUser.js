/**
 * Authorize user against API
 * @param payload
 * {credentials: {username, password}, callback}
 */
const authUser = ({credentials, callback}) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // credentials = {username, password}
    body: JSON.stringify(credentials),
  };

  // Auth user - response: {token, user}
  fetch('/api/0/auth/signin', options)
    .then(function(response) {
      if (response.ok) return response.json();
      throw new Error('Failed API authentication request');
    })
    .then(function(data) {
      callback({
        authenticated: true,
        user: data.user,
        token: data.token,
      });
    })
    .catch(function(error) {
      console.error('Authentication error', error);
    });
};

export default authUser;
