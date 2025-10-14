import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    // redirect if user type not set
    useEffect(() => {
        const userType = localStorage.getItem("userType");
        if (!userType) navigate("/select");
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.email, // ✅ backend expects username
                    password: formData.password,
                }),
            });

            const data = await res.json();
            console.log("🔑 Login response:", data);

            if (!res.ok) throw new Error(data.error || "Login failed");

            // ✅ Save token & user info
            localStorage.setItem("jwtToken", data.token);
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("userName", data.username);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("userType", data.userType);

            window.dispatchEvent(new Event("authChanged"));
            navigate(data.redirectTo || "/providers");
        } catch (err) {
            console.error("❌ Login failed:", err);
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Login to DocOrbit
                </h1>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
            Sign up here
          </span>
                </p>
                <p className="text-center text-sm text-gray-600 mt-2">
              <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Forgot password?
              </span>
                </p>

            </div>
        </main>
    );
};

export default Login;
