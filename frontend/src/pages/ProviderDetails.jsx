// src/pages/ProviderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProviderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDoctor = async () => {
            try {
                // Try cache first
                const cachedDoctors = JSON.parse(localStorage.getItem("cachedDoctors")) || [];
                const found = cachedDoctors.find((d) => String(d.id) === String(id));

                if (found) {
                    setDoctor(found);
                    setLoading(false);
                    return;
                }

                // Otherwise, fetch from backend
                const res = await fetch(`http://localhost:8080/api/doctors/${id}`);
                if (!res.ok) throw new Error("Doctor not found");
                const data = await res.json();
                setDoctor(data);
            } catch (err) {
                console.warn("Could not load doctor details:", err.message);
                setDoctor(null);
            } finally {
                setLoading(false);
            }
        };

        loadDoctor();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Loading doctor details...
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
                <p className="text-gray-600 text-lg mb-4">
                    Doctor details not found 😕
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                    ← Back
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-6 py-10 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-2xl w-full">
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6 shadow-inner border border-gray-200">
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

                <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
                    {doctor.name}
                </h1>
                <p className="text-blue-600 text-center font-semibold mb-4">
                    {doctor.specialization}
                </p>

                <div className="text-gray-700 text-center mb-8">
                    <p>{doctor.clinicName}</p>
                    <p>
                        {doctor.city}, {doctor.country}
                    </p>
                    <p className="text-gray-500 mt-2">⭐ Rating: {doctor.rating || "N/A"}</p>
                </div>

                {/* ✅ Button section */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    >
                        ← Back to Results
                    </button>

                    <button
                        onClick={() => navigate(`/providers/${id}/book`)}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md"
                    >
                        📅 Book Appointment
                    </button>
                </div>
            </div>
        </main>
    );
}
