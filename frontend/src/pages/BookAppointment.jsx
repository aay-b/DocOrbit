import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function BookAppointment() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    // ✅ Load doctor info
    useEffect(() => {
        const loadDoctor = async () => {
            const cached = JSON.parse(localStorage.getItem("cachedDoctors")) || [];
            const found = cached.find((d) => String(d.id) === String(id));

            if (found) {
                setDoctor(found);
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/api/doctors/${id}`);
                if (!res.ok) throw new Error("Doctor not found");
                const data = await res.json();
                setDoctor(data);
            } catch (err) {
                console.warn("Failed to load doctor:", err.message);
            }
        };

        loadDoctor();
    }, [id]);

    // ✅ Handle booking
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!date || !time) {
            alert("Please select both date and time.");
            return;
        }

        setIsBooking(true);
        try {
            const token = localStorage.getItem("jwtToken");

            const res = await fetch("http://localhost:8080/api/appointments/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: new URLSearchParams({
                    doctorId: doctor.id,
                    date,
                    time,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Could not book appointment");
            }

            const data = await res.json();

            // ✅ Store locally for quick view
            const existing = JSON.parse(localStorage.getItem("appointments")) || [];
            localStorage.setItem(
                "appointments",
                JSON.stringify([
                    ...existing,
                    {
                        id: data.id,
                        doctorId: doctor.id,
                        doctorName: doctor.name,
                        specialization: doctor.specialization,
                        date: data.appointmentDate,
                        time: data.appointmentTime,
                        patientName: data.patientName,
                        status: data.status,
                    },
                ])
            );

            setSubmitted(true);
        } catch (err) {
            console.error("Booking error:", err.message);
            setError(err.message || "Could not book appointment.");
        } finally {
            setIsBooking(false);
        }
    };

    // ✅ Loading doctor info
    if (!doctor)
        return (
            <main className="min-h-screen flex items-center justify-center text-gray-600">
                Loading doctor info...
            </main>
        );

    // ✅ Booking success
    if (submitted)
        return (
            <main className="min-h-screen flex items-center justify-center bg-green-50 text-center px-6">
                <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">
                        Appointment Confirmed 🎉
                    </h2>
                    <p className="text-gray-700">
                        Your appointment with <b>{doctor.name}</b> on <b>{date}</b> at <b>{time}</b>{" "}
                        has been successfully booked.
                    </p>
                    {notes && (
                        <p className="text-gray-500 mt-2 text-sm italic">
                            “{notes}”
                        </p>
                    )}
                    <button
                        onClick={() => navigate("/profile")}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    >
                        Go to My Appointments
                    </button>
                </div>
            </main>
        );

    // ✅ Booking form
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-6 py-10 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center shadow-inner border border-gray-200 mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-10 h-10 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 text-center">
                        {doctor.name}
                    </h1>
                    <p className="text-blue-600 font-semibold text-sm mb-1">
                        {doctor.specialization}
                    </p>
                    <p className="text-gray-500 text-sm">
                        {doctor.city}, {doctor.country}
                    </p>
                </div>

                {error && (
                    <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Your Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Appointment Date *
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Appointment Time *
                        </label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1 font-medium">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            placeholder="Add any specific instructions or concerns..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isBooking}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all shadow-md ${
                            isBooking
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                    >
                        {isBooking ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
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
                                Booking appointment...
                            </>
                        ) : (
                            "Confirm Booking"
                        )}
                    </button>
                </form>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-blue-600 hover:underline font-medium"
                >
                    ← Back
                </button>
            </div>
        </main>
    );
}
