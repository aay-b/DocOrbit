import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(null);
    const [canceling, setCanceling] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    // ✅ Fetch user's appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            const token = localStorage.getItem("jwtToken");

            try {
                if (!token) throw new Error("No token found");

                const res = await fetch("http://localhost:8080/api/appointments/my", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

                const data = await res.json();
                const activeOnly = data.filter((a) => a.status !== "CANCELLED");
                setAppointments(activeOnly);
                localStorage.setItem("appointments", JSON.stringify(activeOnly));
            } catch (err) {
                console.error("⚠️ Fetch error:", err.message);
                const stored = JSON.parse(localStorage.getItem("appointments")) || [];
                setAppointments(stored.filter((a) => a.status !== "CANCELLED"));
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    // ✅ Open cancel confirmation modal
    const handleCancel = (id) => {
        setConfirming(id);
    };

    // ✅ Confirm cancel — calls backend and animates
    const confirmCancel = async () => {
        if (!confirming) return;
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        setCanceling(true);

        try {
            const res = await fetch(
                `http://localhost:8080/api/appointments/${confirming}/cancel`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error("Cancel failed");
            await res.json();

            const updated = appointments.filter((appt) => appt.id !== confirming);
            setAppointments(updated);
            localStorage.setItem("appointments", JSON.stringify(updated));

            // ✅ Show custom animated success popup
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (err) {
            console.error("❌ Error cancelling:", err.message);
            alert("Failed to cancel appointment. Please try again.");
        } finally {
            setCanceling(false);
            setConfirming(null);
        }
    };

    // ✅ Loading spinner
    if (loading)
        return (
            <main className="min-h-screen flex items-center justify-center text-gray-600">
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-10 w-10 text-blue-500 mb-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                    <p>Loading your appointments...</p>
                </div>
            </main>
        );

    // ✅ No appointments
    if (appointments.length === 0)
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center px-6 text-center">
                <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full animate-fadeIn">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        📅 My Appointments
                    </h1>
                    <p className="text-gray-600 mb-6">
                        You don’t have any appointments booked yet.
                    </p>
                    <button
                        onClick={() => navigate("/providers")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
                    >
                        Find a Doctor
                    </button>
                </div>
            </main>
        );

    // ✅ Main appointments list
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-6 py-10 flex flex-col items-center relative">
            <div className="max-w-3xl w-full">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 animate-fadeIn">
                    📅 My Appointments
                </h1>

                <div className="grid grid-cols-1 gap-6">
                    {appointments.map((appt, i) => (
                        <div
                            key={appt.id}
                            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all animate-slideUp"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {appt.doctorName}
                                    </h2>
                                    <p className="text-blue-600 font-medium text-sm">
                                        {appt.specialization}
                                    </p>
                                </div>
                                <p className="text-gray-500 text-sm mt-2 sm:mt-0">
                                    ID: {appt.id}
                                </p>
                            </div>

                            <div className="text-gray-700 mb-3">
                                <p>
                                    <span className="font-semibold">Date:</span>{" "}
                                    {appt.appointmentDate || appt.date}
                                </p>
                                <p>
                                    <span className="font-semibold">Time:</span>{" "}
                                    {appt.appointmentTime
                                        ? appt.appointmentTime.substring(0, 5)
                                        : appt.time}
                                </p>
                                {appt.notes && (
                                    <p className="text-gray-600 mt-2 italic">“{appt.notes}”</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => handleCancel(appt.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* ✅ Cancel Confirmation Modal */}
            {confirming && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-popUp">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Cancel Appointment?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this appointment? This action
                            cannot be undone.
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirming(null)}
                                disabled={canceling}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-xl font-semibold transition-all disabled:opacity-60"
                            >
                                No, Keep It
                            </button>
                            <button
                                onClick={confirmCancel}
                                disabled={canceling}
                                className={`bg-red-500 text-white px-5 py-2 rounded-xl font-semibold shadow-md transition-all ${
                                    canceling
                                        ? "opacity-70 cursor-not-allowed"
                                        : "hover:bg-red-600"
                                }`}
                            >
                                {canceling ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-popUp">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-14 h-14 mx-auto mb-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <h2 className="text-2xl font-bold mb-2">Appointment Cancelled</h2>
                        <p className="text-sm opacity-90">
                            Your appointment was successfully cancelled.
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}

/* Tailwind animation utility (add this in your global.css if missing):
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-popUp { animation: popUp 0.25s ease-out; }
.animate-slideUp { animation: slideUp 0.3s ease-out both; }
*/
