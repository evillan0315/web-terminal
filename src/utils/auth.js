export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const parsedToken = JSON.parse(token);
      
      // Check if ExpiresIn is provided, otherwise return null
      const expirationDuration = parsedToken?.ExpiresIn || 0; // ExpiresIn is the duration in seconds
      const tokenReceivedTime = Math.floor(Date.now() / 1000); // Current time in seconds when the token was received

      // Calculate expiration time by adding ExpiresIn to tokenReceivedTime
      const tokenExpirationTime = tokenReceivedTime + expirationDuration;
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds


      if (tokenExpirationTime < currentTime) {

        // Redirect to login or handle expired token
        // window.location.href = "/login";  // Or use a routing method if using React Router
        return null; // Token expired, return null
      }

      return parsedToken.AccessToken || null; // Return AccessToken if valid
    } catch (error) {
      console.error("Error parsing token:", error);
      return null; // Return null if there's a JSON parsing error
    }
  }

  return null; // Return null if token is not found
};
