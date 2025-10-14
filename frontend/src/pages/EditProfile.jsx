// src/pages/EditProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        dob: "",
        userType: "",
        specialization: "",
        clinicName: "",
        clinicAddress: "",
        clinicCity: "",
        clinicState: "",
        clinicCountry: "",
        clinicPhone: "",
    });

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        const storedType = localStorage.getItem("userType") || "patient";

        // Load saved data
        setFormData({
            name: localStorage.getItem("userName") || "",
            email: localStorage.getItem("userEmail") || "",
            phone: localStorage.getItem("userPhone") || "",
            address: localStorage.getItem("userAddress") || "",
            gender: localStorage.getItem("userGender") || "",
            dob: localStorage.getItem("userDob") || "",
            userType: storedType,
            specialization: localStorage.getItem("specialization") || "",
            clinicName: localStorage.getItem("clinicName") || "",
            clinicAddress: localStorage.getItem("clinicAddress") || "",
            clinicCity: localStorage.getItem("clinicCity") || "",
            clinicState: localStorage.getItem("clinicState") || "",
            clinicCountry: localStorage.getItem("clinicCountry") || "",
            clinicPhone: localStorage.getItem("clinicPhone") || "",
        });
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Save to localStorage
        localStorage.setItem("userName", formData.name);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userPhone", formData.phone);
        localStorage.setItem("userAddress", formData.address);
        localStorage.setItem("userGender", formData.gender);
        localStorage.setItem("userDob", formData.dob);

        if (formData.userType === "doctor") {
            localStorage.setItem("specialization", formData.specialization);
            localStorage.setItem("clinicName", formData.clinicName);
            localStorage.setItem("clinicAddress", formData.clinicAddress);
            localStorage.setItem("clinicCity", formData.clinicCity);
            localStorage.setItem("clinicState", formData.clinicState);
            localStorage.setItem("clinicCountry", formData.clinicCountry);
            localStorage.setItem("clinicPhone", formData.clinicPhone);
        }

        navigate("/profile");
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-6 py-12">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    ✏️ Edit Profile
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Common Fields */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    {/* Doctor fields */}
                    {formData.userType === "doctor" && (
                        <>
                            <h3 className="text-lg font-bold text-gray-700 mt-4 mb-2">
                                Specialization & Clinic Details
                            </h3>

                            <input
                                type="text"
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                placeholder="Specialization"
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <input
                                type="text"
                                name="clinicName"
                                value={formData.clinicName}
                                onChange={handleChange}
                                placeholder="Clinic Name"
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <input
                                type="text"
                                name="clinicAddress"
                                value={formData.clinicAddress}
                                onChange={handleChange}
                                placeholder="Clinic Address"
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="clinicCity"
                                    value={formData.clinicCity}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    type="text"
                                    name="clinicState"
                                    value={formData.clinicState}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="clinicCountry"
                                    value={formData.clinicCountry}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    type="text"
                                    name="clinicPhone"
                                    value={formData.clinicPhone}
                                    onChange={handleChange}
                                    placeholder="Clinic Phone"
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
