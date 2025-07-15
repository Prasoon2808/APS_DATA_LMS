import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";

const storage = localStorage;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      axios
        .get(`${config.backendUrl}/api/auth/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser({
            token,
            ...res.data.user,
          });
        })
        .catch(() => {
          localStorage.clear();
          sessionStorage.clear();
          setUser(null);
        });
    }
  }, []);

  const login = (data, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", data.token);
    storage.setItem("role", data.user.role);
    storage.setItem("userId", data.user._id);
    storage.setItem("email", data.user.email);
    storage.setItem("name", data.user.name);
    storage.setItem("institution", data.user.institution);
    storage.setItem("phone", data.user.phone);
    storage.setItem("country", data.user.country);
    storage.setItem("gender", data.user.gender);
    storage.setItem("avatar", data.user.avatar || "1.jpg");


    setUser({
      token: data.token,
      role: data.user.role,
      email: data.user.email,
      _id: data.user._id,
      name: data.user.name,
      institution: data.user.institution,
      phone: data.user.phone,
      country: data.user.country,
      gender: data.user.gender,
      avatar: data.user.avatar || "1.jpg",
    });
  };

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
