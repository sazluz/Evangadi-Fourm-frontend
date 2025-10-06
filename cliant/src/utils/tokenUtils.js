function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000; // seconds
    // If no exp field, assume not expired
    if (!payload.exp) return false;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false; // don’t remove token if it’s malformed
  }
}
export default isTokenExpired;
