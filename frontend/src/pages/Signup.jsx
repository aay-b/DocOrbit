import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    // Redirect to /select if userType not set
    useEffect(() => {
        const userType = localStorage.getItem("userType");
        if (!userType) navigate("/select");
    }, [navigate]);

    const userType = localStorage.getItem("userType") || "patient";
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/api/specializations")
            .then((res) => res.json())
            .then(setSpecializations)
            .catch(() => setSpecializations([]));
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: "",
        dob: "",
        specialization: "",
        clinicName: "",
        clinicAddress: "",
        clinicCity: "",
        clinicState: "",
        clinicCountry: "",
        clinicPhone: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Build payload for backend
            const payload = {
                username: formData.email,
                password: formData.password,
                name: formData.name,
                gender: formData.gender || "OTHER",
                dob: formData.dob,
                phoneNumber: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.clinicCity || "N/A",
                state: formData.clinicState || "N/A",
                zip: "00000",
                country: formData.clinicCountry || "N/A",
                roles: [userType.toUpperCase()], // backend expects enum Role (e.g. PATIENT / DOCTOR)
            };

            console.log("📤 Sending signup payload:", payload);

            const res = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Signup failed");
            }

            const message = await res.text();
            console.log("✅ Signup success:", message);

            // Auto-login after signup
            const loginRes = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.email,
                    password: formData.password,
                }),
            });

            if (!loginRes.ok) throw new Error("Auto-login failed after signup");

            const loginData = await loginRes.json();
            console.log("🔑 Auto-login success:", loginData);

            // Save token + user info
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("jwtToken", loginData.token);
            localStorage.setItem("userName", loginData.username || formData.name);
            localStorage.setItem("userEmail", loginData.email || formData.email);
            localStorage.setItem("userType", userType);

            window.dispatchEvent(new Event("authChanged"));

            navigate("/providers");
        } catch (err) {
            console.error("❌ Signup error:", err);
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">
                    {userType === "doctor" ? "Doctor Signup" : "Patient Signup"}
                </h1>
                <p className="text-gray-500 mb-8 text-center">
                    Fill in your details to create your {userType} account.
                </p>

                {error && (
                    <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* COMMON FIELDS */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    {/* ✅ PASSWORD FIELD WITH TOGGLE */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 text-sm focus:outline-none"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
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
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <input
                        type="date"
                        name="dob"
                        placeholder="Date of Birth"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    {/* ONLY FOR DOCTORS */}
                    {userType === "doctor" && (
                        <>
                            <select
                                name="specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map((s) => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                                <option value="other">Other (Enter manually)</option>
                            </select>

                            {formData.specialization === "other" && (
                                <input
                                    type="text"
                                    name="specialization"
                                    placeholder="Enter your specialization"
                                    value={formData.customSpecialization || ""}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none mt-2"
                                />
                            )}


                            <h3 className="text-lg font-bold text-gray-700 mt-4 mb-2">
                                Clinic Details
                            </h3>

                            <input
                                type="text"
                                name="clinicName"
                                placeholder="Clinic Name"
                                value={formData.clinicName}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <input
                                type="text"
                                name="clinicAddress"
                                placeholder="Clinic Address"
                                value={formData.clinicAddress}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="clinicCity"
                                    placeholder="City"
                                    value={formData.clinicCity}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    type="text"
                                    name="clinicState"
                                    placeholder="State"
                                    value={formData.clinicState}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="clinicCountry"
                                    placeholder="Country"
                                    value={formData.clinicCountry}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    type="text"
                                    name="clinicPhone"
                                    placeholder="Clinic Phone Number"
                                    value={formData.clinicPhone}
                                    onChange={handleChange}
                                    required
                                    className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`${
                            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                        } text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all mt-3`}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-5 text-center">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
            Login here
          </span>
                </p>
            </div>
        </div>
    );
}
