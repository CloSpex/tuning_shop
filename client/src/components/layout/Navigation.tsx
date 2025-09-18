import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export interface NavigationItem {
  path: string;
  label: string;
  requiresAuth?: boolean;
}

export const navigationItems: NavigationItem[] = [
  { path: "/", label: "Home" },
  { path: "/users", label: "Users", requiresAuth: true },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const visibleItems = navigationItems.filter(
    (item) => !item.requiresAuth || isAuthenticated
  );

  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        {visibleItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            style={{
              marginRight: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor:
                location.pathname === item.path ? "#007bff" : "#f8f9fa",
              color: location.pathname === item.path ? "#fff" : "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: "0.9rem", color: "#666" }}>
              Welcome, {user?.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => handleNavigation("/login")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
