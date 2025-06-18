import { createContext, useContext, useState, useEffect } from "react";

const storage = localStorage;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = storage.getItem("token");
    const role = storage.getItem("role");
    const _id = storage.getItem("userId");
    const email = storage.getItem("email");
    const name = storage.getItem("name"); // ✅ new

    if (token && role && _id) {
      setUser({ token, role, email, _id, name }); // ✅ include name
    }
  }, []);

  const login = (data) => {
    storage.setItem("token", data.token);
    storage.setItem("role", data.user.role);
    storage.setItem("userId", data.user._id);
    storage.setItem("email", data.user.email);
    storage.setItem("name", data.user.name); // ✅ save name

    setUser({
      token: data.token,
      role: data.user.role,
      email: data.user.email,
      _id: data.user._id,
      name: data.user.name, // ✅ add to state
    });
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
