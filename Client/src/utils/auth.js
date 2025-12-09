/**
 * Decodes the JWT token from localStorage to retrieve user information.
 * This avoids relying on potentially tampered localStorage 'role' or 'username' keys.
 */
export const getAuthData = () => {
    const token = localStorage.getItem('token');
    if (!token) return { role: null, username: null, userId: null };
  
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid token:", error);
      return { role: null, username: null, userId: null };
    }
  };
  
  export const getUserRole = () => {
      return getAuthData().role;
  };
  
  export const getUsername = () => {
      return getAuthData().username;
  };
