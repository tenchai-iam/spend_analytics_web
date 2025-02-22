import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data after login
    axios
      .get("https://dev-spendi-tcc.pea.co.th/api/get_hrplatform_data", {
        withCredentials: true, // Ensure API sends back user info
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
