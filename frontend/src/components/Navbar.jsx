// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HeartPulse } from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ Detect route changes
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    // 🧠 Centralized auth check
    const checkAuth = () => {
        const loggedIn = localStorage.getItem("userLoggedIn") === "true";
        const storedName = localStorage.getItem("userName") || "";
        setIsLoggedIn(loggedIn);
        setUserName(storedName);
    };

    // 🔄 Check on mount, storage changes, AND route changes
    useEffect(() => {
        checkAuth(); // initial load
        window.addEventListener("storage", checkAuth);
        window.addEventListener("authChanged", checkAuth); // custom event from signup/login

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("authChanged", checkAuth);
        };
    }, []);

    // ✅ Re-run on navigation (so “Back” button updates UI)
    useEffect(() => {
        checkAuth();
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName("");
        window.dispatchEvent(new Event("authChanged"));
        navigate("/");
    };

    // --- STYLES ---
    const navStyle = {
        width: "100%",
        background: "#ffffff",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 9999,
    };

    const containerStyle = {
        maxWidth: 1120,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
    };

    const brandStyle = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        textDecoration: "none",
        color: "#111827",
    };

    const brandTextStyle = {
        fontSize: 20,
        fontWeight: 700,
        letterSpacing: "-0.2px",
    };

    const btnBase = {
        padding: "12px 26px",
        fontSize: 16,
        borderRadius: 12,
        fontWeight: 600,
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
        lineHeight: 1,
        transition: "all 0.2s ease",
    };

    const loginStyle = {
        ...btnBase,
        color: "#2563EB",
        background: "#F3F8FF",
        border: "2px solid #2563EB",
        marginRight: 20,
    };

    const signupStyle = {
        ...btnBase,
        color: "#ffffff",
        background: "#2563EB",
        border: "2px solid #2563EB",
    };

    const profileStyle = {
        ...btnBase,
        color: "#ffffff",
        background: "#10B981",
        border: "2px solid #10B981",
        marginRight: 20,
    };

    const logoutStyle = {
        ...btnBase,
        color: "#EF4444",
        background: "#FEE2E2",
        border: "2px solid #EF4444",
    };

    return (
        <nav style={navStyle}>
            <div style={containerStyle}>
                <Link to="/" style={brandStyle}>
                    <HeartPulse size={28} color="#2563EB" />
                    <span style={brandTextStyle}>DocOrbit</span>
                </Link>

                {isLoggedIn ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                            onClick={() => navigate("/profile")}
                            style={profileStyle}
                        >
                            👤 {userName || "Profile"}
                        </button>
                        <button onClick={handleLogout} style={logoutStyle}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Link
                            to="/select"
                            onClick={() => localStorage.setItem("authAction", "login")}
                            style={loginStyle}
                        >
                            Login
                        </Link>
                        <Link
                            to="/select"
                            onClick={() => localStorage.setItem("authAction", "signup")}
                            style={signupStyle}
                        >
                            Signup
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
