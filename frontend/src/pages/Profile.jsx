// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        const type = localStorage.getItem("userType") || "patient";

        const data = {
            name: localStorage.getItem("userName") || "User",
            email: localStorage.getItem("userEmail") || "Not provided",
            phone: localStorage.getItem("userPhone") || "Not provided",
            address: localStorage.getItem("userAddress") || "Not provided",
            gender: localStorage.getItem("userGender") || "Not provided",
            dob: localStorage.getItem("userDob") || "Not provided",
            userType: type,
        };

        if (type === "doctor") {
            data.specialization = localStorage.getItem("specialization") || "Not provided";
            data.clinicName = localStorage.getItem("clinicName") || "Not provided";
            data.clinicAddress = localStorage.getItem("clinicAddress") || "Not provided";
            data.clinicCity = localStorage.getItem("clinicCity") || "Not provided";
            data.clinicState = localStorage.getItem("clinicState") || "Not provided";
            data.clinicCountry = localStorage.getItem("clinicCountry") || "Not provided";
            data.clinicPhone = localStorage.getItem("clinicPhone") || "Not provided";
        }

        setUserData(data);
    }, [navigate]);

    if (!userData) return null;

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center px-6 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    👤 My Profile
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center shadow-inner border border-gray-200 mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-12 h-12 text-gray-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
                                />
                            </svg>
                        </div>

                        <p className="text-blue-600 font-semibold text-sm capitalize">
                            {userData.userType}
                        </p>
                    </div>

                    {/* Info Card */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500 text-sm">Full Name</p>
                            <p className="text-gray-800 font-semibold">{userData.name}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Email</p>
                            <p className="text-gray-800 font-semibold">{userData.email}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Phone</p>
                            <p className="text-gray-800 font-semibold">{userData.phone}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Address</p>
                            <p className="text-gray-800 font-semibold">{userData.address}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Gender</p>
                            <p className="text-gray-800 font-semibold">{userData.gender}</p>
                        </div>

                        <div>
                            <p className="text-gray-500 text-sm">Date of Birth</p>
                            <p className="text-gray-800 font-semibold">{userData.dob}</p>
                        </div>

                        {/* 🩺 Doctor-only fields */}
                        {userData.userType === "doctor" && (
                            <>
                                <div>
                                    <p className="text-gray-500 text-sm">Specialization</p>
                                    <p className="text-gray-800 font-semibold">{userData.specialization}</p>
                                </div>

                                <div className="col-span-2 mt-4">
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">Clinic Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-500 text-sm">Clinic Name</p>
                                            <p className="text-gray-800 font-semibold">{userData.clinicName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Phone</p>
                                            <p className="text-gray-800 font-semibold">{userData.clinicPhone}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Address</p>
                                            <p className="text-gray-800 font-semibold">
                                                {userData.clinicAddress}, {userData.clinicCity}, {userData.clinicState}, {userData.clinicCountry}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center mt-10 gap-4 flex-wrap">
                    <button
                        onClick={() => navigate("/edit-profile")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
                    >
                        Edit Profile
                    </button>

                    {/* ✅ New Button: My Appointments */}
                    <button
                        onClick={() => navigate("/appointments")}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
                    >
                        My Appointments
                    </button>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate("/");
                            window.location.reload();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </main>
    );
}
