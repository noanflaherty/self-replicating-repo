export const loadTokenFromLocalStorage = () => {
  const token = localStorage.getItem('github_token');
  try {
    if (token === null || token == 'null') {
      return undefined;
    }

    return token;
  } catch (err) {
    return undefined;
  }
};

export const saveTokenToLocalStorage = (token) => {
  try {
    localStorage.setItem('github_token', token);
  } catch (err) {
    console.log('Failed to save GitHub auth token to local storage.');
  }
};
