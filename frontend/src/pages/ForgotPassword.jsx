// src/pages/ForgotPassword.jsx
import React, { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) throw new Error("Failed to send reset link");

            setMessage("✅ If this email is registered, a reset link has been sent!");
            setEmail("");
        } catch (err) {
            console.error("❌ Forgot password error:", err.message);
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
                    Forgot Password
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Enter your email address and we’ll send you a link to reset your password.
                </p>

                {error && (
                    <p className="text-red-600 text-center font-medium mb-3">{error}</p>
                )}
                {message && (
                    <p className="text-green-600 text-center font-medium mb-3">{message}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md transition-all ${
                            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p
                    onClick={() => (window.location.href = "/login")}
                    className="text-center text-sm text-blue-600 hover:underline mt-4 cursor-pointer"
                >
                    ← Back to Login
                </p>
            </div>
        </main>
    );
}
