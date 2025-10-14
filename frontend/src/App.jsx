import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Providers from "./pages/Providers";
import Navbar from "./components/Navbar";
import UserTypeSelect from "./pages/UserTypeSelect";
import LearnMore from "./pages/LearnMore";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ProviderDetails from "./pages/ProviderDetails";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DoctorDashboard from "./pages/DoctorDashboard";







function AppContent() {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const hideNavbar = ["/login", "/signup"].includes(location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/select" element={<UserTypeSelect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/learn-more" element={<LearnMore />} />
                <Route path="/profile" element={<Profile />} />

                <Route
                    path="/providers"
                    element={isLoggedIn ? <Providers /> : <Navigate to="/login" replace />}
                />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/providers/:id" element={<ProviderDetails />} />
                <Route path="/providers/:id/book" element={<BookAppointment />} />
                <Route path="/appointments" element={<MyAppointments />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />





            </Routes>
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
