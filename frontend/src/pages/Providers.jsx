// src/pages/Providers.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

function isInsideProviders(pathname) {
    // ✅ Only true for /providers or /providers/
    return /^\/providers(\/)?$/.test(pathname);
}

export default function Providers() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const mountedRef = useRef(false);

    const savedState = (() => {
        try {
            const raw = sessionStorage.getItem("providersState");
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();

    const [doctors, setDoctors] = useState(
        Array.isArray(savedState.doctors) && savedState.doctors.length > 0
            ? savedState.doctors
            : []
    );
    const [search, setSearch] = useState(savedState.search || "");
    const [specialization, setSpecialization] = useState(savedState.specialization || "");
    const [loading, setLoading] = useState(false);

    const mockDoctors = [
        {
            id: 1,
            name: "Dr. Sophia Chen",
            specialization: "Cardiologist",
            clinicName: "HealthPlus Clinic",
            city: "Toronto",
            country: "Canada",
            rating: 4.8,
        },
        {
            id: 2,
            name: "Dr. Alejandro Rivera",
            specialization: "Orthodontist",
            clinicName: "SmileBright Dental",
            city: "Mexico City",
            country: "Mexico",
            rating: 4.6,
        },
        {
            id: 3,
            name: "Dr. Emma Johansson",
            specialization: "Dermatologist",
            clinicName: "SkinCare Center",
            city: "Stockholm",
            country: "Sweden",
            rating: 4.9,
        },
    ];

    const SESSION_KEY = "providersState";
    const CACHE_KEY = "cachedDoctors";

    const saveSessionState = (extra = {}) => {
        try {
            const payload = {
                doctors,
                search,
                specialization,
                scrollY: window.scrollY || 0,
                ...extra,
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
        } catch (e) {
            console.warn("Could not save providers session state:", e);
        }
    };

    const restoreSessionState = () => {
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn("Failed to parse session state:", e);
            return null;
        }
    };

    const fetchFromBackend = async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Request failed ${res.status}`);
        return res.json();
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            let data;
            try {
                data = await fetchFromBackend("http://localhost:8080/api/doctors");
            } catch (_) {
                data = await fetchFromBackend("http://localhost:8080/api/doctors/all");
            }
            setDoctors(data);
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn("Using mock doctors due to backend error:", error.message);
            setDoctors(mockDoctors);
            localStorage.setItem(CACHE_KEY, JSON.stringify(mockDoctors));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        mountedRef.current = true;

        const saved = restoreSessionState();
        const specFromUrl = searchParams.get("spec");
        const searchFromUrl = searchParams.get("q");

        if ((specFromUrl && specFromUrl !== "") || (searchFromUrl && searchFromUrl !== "")) {
            setSearch(searchFromUrl || "");
            setSpecialization(specFromUrl || "");
            fetchDoctors();
        } else if (saved && Array.isArray(saved.doctors) && saved.doctors.length > 0) {
            setDoctors(saved.doctors);
            if (saved.search !== undefined) setSearch(saved.search);
            if (saved.specialization !== undefined) setSpecialization(saved.specialization);
            setTimeout(() => {
                if (saved.scrollY) window.scrollTo(0, saved.scrollY);
            }, 0);
        } else {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setDoctors(parsed);
                    } else {
                        fetchDoctors();
                    }
                } catch {
                    fetchDoctors();
                }
            } else {
                fetchDoctors();
            }
        }

        const onPopState = () => {
            const s = restoreSessionState();
            if (s) {
                if (s.search !== undefined) setSearch(s.search);
                if (s.specialization !== undefined) setSpecialization(s.specialization);
                if (Array.isArray(s.doctors) && s.doctors.length > 0) setDoctors(s.doctors);
                setTimeout(() => {
                    if (s.scrollY) window.scrollTo(0, s.scrollY);
                }, 0);
            }
        };

        window.addEventListener("popstate", onPopState);
        const handleBeforeUnload = () => {
            if (isInsideProviders(window.location.pathname)) {
                saveSessionState();
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // ✅ Save only if still on main /providers page
            if (isInsideProviders(window.location.pathname)) {
                saveSessionState();
            }
            window.removeEventListener("popstate", onPopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!mountedRef.current) return;
        if (isInsideProviders(window.location.pathname)) {
            saveSessionState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctors, search, specialization]);


    const handleSearch = async () => {
        setLoading(true);
        try {
            let data;
            const baseUrl = "http://localhost:8080/api/doctors";

            // 🩺 CASE 1: All Specialties + empty search → fetch ALL doctors fresh
            if (specialization === "" && search.trim() === "") {
                console.log("🔄 Fetching ALL doctors (All Specialties selected)");
                try {
                    data = await fetchFromBackend(baseUrl);
                    // ✅ If backend /api/doctors returns empty, try fallback /all
                    if (!data || data.length === 0) {
                        console.log("⚠️ /api/doctors returned empty, retrying /api/doctors/all");
                        data = await fetchFromBackend(`${baseUrl}/all`);
                    }
                } catch (err) {
                    console.warn("⚠️ Fallback to /api/doctors/all due to fetch error");
                    data = await fetchFromBackend(`${baseUrl}/all`);
                }
            }
            // 🩺 CASE 2: Only specialization selected → filter by specialization
            else if (specialization !== "" && search.trim() === "") {
                console.log(`🔎 Fetching doctors with specialization: ${specialization}`);
                data = await fetchFromBackend(
                    `${baseUrl}/specialization/${encodeURIComponent(specialization)}`
                );
            }
            // 🩺 CASE 3: Only search query → search by name
            else if (search.trim() !== "" && specialization === "") {
                console.log(`🔍 Searching doctors by name: ${search}`);
                data = await fetchFromBackend(
                    `${baseUrl}/search?name=${encodeURIComponent(search)}`
                );
            }
            // 🩺 CASE 4: Both specialization + search applied
            else {
                console.log(`🧩 Searching doctors by name '${search}' and spec '${specialization}'`);
                const all = await fetchFromBackend(baseUrl);
                data = all.filter(
                    (doc) =>
                        doc.name.toLowerCase().includes(search.toLowerCase()) &&
                        doc.specialization.toLowerCase() === specialization.toLowerCase()
                );
            }

            // 🧠 Cache & update state
            setDoctors(data);
            console.log("✅ Doctors loaded:", data);
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            saveSessionState();
        } catch (err) {
            console.error("❌ Search failed, falling back to mock data:", err);

            // 🧩 Local fallback filter
            const filtered = mockDoctors.filter((doc) => {
                const matchName = doc.name.toLowerCase().includes(search.toLowerCase());
                const matchSpec =
                    specialization === "" ||
                    doc.specialization.toLowerCase() === specialization.toLowerCase();
                return matchName && matchSpec;
            });

            setDoctors(filtered);
            saveSessionState();
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };



    const handleViewDetails = (id) => {
        // ✅ Only save when on main listing page
        if (isInsideProviders(window.location.pathname)) {
            saveSessionState({ scrollY: window.scrollY });
        }
        navigate(`/providers/${id}`);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    Find Trusted Doctors & Dentists 🌍
                </h1>

                <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 mb-10">
                    <input
                        type="text"
                        placeholder="Search by name or clinic..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none w-full"
                    />

                    <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        <option value="">All Specialties</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dentist">Dentist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Orthodontist">Orthodontist</option>
                        <option value="Pediatrician">Pediatrician</option>
                    </select>

                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg"
                    >
                        Search
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-600">Loading doctors...</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.length === 0 ? (
                            <p className="text-center text-gray-500 col-span-full">
                                No providers found.
                            </p>
                        ) : (
                            doctors.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all"
                                >
                                    <div>
                                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-inner border border-gray-200">
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

                                        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
                                            {doc.name}
                                        </h2>
                                        <p className="text-center text-blue-600 font-semibold mb-2">
                                            {doc.specialization}
                                        </p>
                                        <p className="text-center text-gray-600 text-sm">
                                            {doc.clinicName}
                                        </p>
                                        <p className="text-center text-gray-500 text-sm">
                                            {doc.city}, {doc.country}
                                        </p>
                                    </div>

                                    <div className="mt-4 text-center">
                                        <button
                                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition-all"
                                            onClick={() => handleViewDetails(doc.id)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
