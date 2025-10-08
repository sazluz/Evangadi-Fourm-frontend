import React, { createContext, useState, useEffect } from "react";

// Initialize context
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    localStorage.setItem("user", JSON.stringify(user));
    // setUser(user);

    if (token && user) {
      setUser({ token, user }); // Set the user token if available
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
