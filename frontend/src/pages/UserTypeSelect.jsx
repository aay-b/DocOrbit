// src/pages/UserTypeSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserTypeSelect() {
    const navigate = useNavigate();

    const handleSelect = (type) => {
        localStorage.setItem("userType", type);
        const action = localStorage.getItem("authAction");

        if (action === "signup") navigate("/signup");
        else navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                    Welcome to DocOrbit
                </h1>
                <p className="text-gray-600 mb-8 text-base">
                    Please select your role to continue
                </p>

                <div className="flex flex-col gap-5">
                    <button
                        onClick={() => handleSelect("doctor")}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all"
                    >
                        👩‍⚕️ I am a Doctor
                    </button>

                    <button
                        onClick={() => handleSelect("patient")}
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold text-lg transition-all"
                    >
                        🧑‍💼 I am a Patient
                    </button>
                </div>
            </div>
        </div>
    );
}
