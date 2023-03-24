import Axios from "axios";
import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../../config";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  Axios.defaults.withCredentials = true;
  const [userData, setUserData] = useState("");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [signatoriesUser, setSignatoriesUser] = useState(
    JSON.parse(localStorage.getItem("signatories")) || null
  );
  const [adminUser, setAdminUser] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  );
  const [superadminUser, setSuperAdminUser] = useState(
    JSON.parse(localStorage.getItem("superadmin")) || null
  );

  const login = async (username, password) => {
    const res = await axiosInstance.post(
      "/auth/login",
      {
        username,
        password,
      }
    );
    setCurrentUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const logout = async (username, password) => {
    await Axios.axiosInstance("http://localhost:3001/api/auth/logout");
    setCurrentUser(null);
  };

  const adminLogout = async (username, password) => {
    await Axios.post("http://localhost:3001/api/admin/auth/adminLogout");
    setAdminUser(null);
    window.location.href = "/admin/login";
  };

  const signatoriesLogout = async (username, password) => {
    await Axios.post(
      "http://localhost:3001/api/signatories/auth/signatoriesLogout"
    );
    setSignatoriesUser(null);
  };

  const signatoriesLogin = async (username, password) => {
    const res = await Axios.post(
      "http://localhost:3001/api/signatories/auth/signatoriesLogin",
      {
        username,
        password,
      }
    );
    window.location.href = "/signatories/dashboards";
    setSignatoriesUser(res.data.token);
  };

  const AdminLogin = async (username, password) => {
    const res = await Axios.post(
      "http://localhost:3001/api/admin/auth/adminLogin",
      {
        username,
        password,
      }
    );

    setUserData(res.data);
  };

  const superAdminLogin = async (username, password) => {
    const res = await Axios.post(
      "http://localhost:3001/api/superadmin/auth/superadminLogin",
      {
        username,
        password,
      }
    );

    setSuperAdminUser(res.data);
  };

  const superAdminLogout = async (username, password) => {
    await Axios.post(
      "http://localhost:3001/api/superadmin/auth/superadminLogout"
    );
    setSuperAdminUser(null);
    window.location.href = "/superadmin/login";
  };

  useEffect(() => {
    localStorage.setItem("signatories", JSON.stringify(signatoriesUser));
  }, [signatoriesUser]);

  useEffect(() => {
    localStorage.setItem("superadmin", JSON.stringify(superadminUser));
  }, [superadminUser]);

  useEffect(() => {
    if (userData.userRole === "ADMIN") {
      setAdminUser(userData.token);
    } else if (userData.userRole === "SIGNATORIES") {
      signatoriesLogin(userData.username, userData.password);
    }
  }, [userData]);
  useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(adminUser));
  }, [adminUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        signatoriesLogout,
        AdminLogin,
        adminLogout,
        superAdminLogin,
        superAdminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
