import React from "react";

export default function DoctorDashboard() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">👨‍⚕️ Doctor Dashboard</h1>
                <p className="text-gray-600">
                    Welcome to your dashboard! Here you'll be able to view and manage your appointments.
                </p>
            </div>
        </main>
    );
}
