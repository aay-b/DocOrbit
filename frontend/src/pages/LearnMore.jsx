// src/pages/LearnMore.jsx
import React from "react";

export default function LearnMore() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-start px-6 py-12">
            <div className="max-w-3xl text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
                    About DocOrbit 🌍
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    DocOrbit helps patients find and connect with trusted doctors
                    and dentists around the world. Whether you’re traveling, relocating,
                    or seeking specialized care, our platform makes it easy to discover
                    healthcare providers that match your needs.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-blue-600 mb-3">
                            🌐 Search Worldwide
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Find verified doctors and dentists from over 50+ countries and
                            connect instantly.
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-green-600 mb-3">
                            💬 Connect Easily
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Message or book appointments directly with providers — no middleman.
                        </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-pink-600 mb-3">
                            ⭐ Trusted Reviews
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Read verified patient reviews to help you make informed choices.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        localStorage.setItem("authAction", "signup");
                        window.location.href = "/select";
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold shadow-lg transition-all"
                >
                    Get Started
                </button>
            </div>
        </main>
    );
}
