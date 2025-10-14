import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (!res.ok) throw new Error("Reset failed");

            setSuccess(true);
            setMessage("✅ Password reset successfully!");
            setTimeout(() => navigate("/login"), 5000); // Auto-redirect after 5s
        } catch (err) {
            setError("❌ Invalid or expired reset link.");
        } finally {
            setLoading(false);
        }
    };

    // 🎉 Success screen
    if (success) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
                <Confetti recycle={false} numberOfPieces={350} />
                <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-green-600 mb-4">Password Reset Successful!</h1>
                    <p className="text-gray-600 mb-6">
                        You can now log in with your new password. Redirecting you to the login page...
                    </p>
                    <div className="animate-bounce text-4xl">🎉</div>
                </div>
            </main>
        );
    }

    // 🧩 Reset form UI
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Reset Password
                </h1>

                {error && (
                    <p className="text-center mb-4 text-red-600 font-medium">{error}</p>
                )}
                {message && (
                    <p className="text-center mb-4 text-green-600 font-medium">{message}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md transition-all ${
                            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
                        }`}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </main>
    );
}
