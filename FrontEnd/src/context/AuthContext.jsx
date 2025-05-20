import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from storage
  useEffect(() => {
    const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
    const token = storage.getItem("token");
    const role = storage.getItem("role");
    const email = storage.getItem("email");

    if (token && role) {
      setUser({ token, role, email });
    }
  }, []);

  // Login function
  const login = (data, remember) => {
    const storage = remember ? localStorage : sessionStorage;
  
    storage.setItem("token", data.token);
    storage.setItem("role", data.user.role);
    storage.setItem("email", data.user.email);
  
    setUser({ token: data.token, role: data.user.role, email: data.user.email });
  };

  // Logout function
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
