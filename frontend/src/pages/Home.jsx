// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const imageLinks = [
        "https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3825523/pexels-photo-3825523.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/8460185/pexels-photo-8460185.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/5452200/pexels-photo-5452200.jpeg?auto=compress&cs=tinysrgb&w=800",
    ];

    const reviews = [
        {
            name: "Madison Rivera",
            rating: 5,
            review:
                "Fantastic experience! I found a great dentist in Thailand using DocOrbit. Booking was super easy and communication was seamless.",
        },
        {
            name: "Sofia Martinez",
            rating: 4,
            review:
                "Clean design, quick to navigate, and helpful filters. I booked a dermatologist abroad without any hassle!",
        },
        {
            name: "Michael Johnson",
            rating: 5,
            review:
                "Honestly, this feels like the Airbnb of healthcare. Trustworthy listings and clear reviews — highly recommend!",
        },
    ];

    const mainStyle = {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #EFF6FF 0%, #ECFDF5 100%)",
        padding: "0 24px 80px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const heroWrapper = {
        width: "100%",
        maxWidth: 920,
        textAlign: "center",
        marginTop: 8,
    };

    const titleStyle = {
        fontSize: "2.4rem",
        lineHeight: 1.05,
        fontWeight: 800,
        color: "#0f172a",
        margin: "10px 0 12px",
    };

    const subtitleStyle = {
        fontSize: "1.05rem",
        color: "#475569",
        margin: "0 0 18px",
    };

    const buttonsRow = {
        display: "inline-flex",
        gap: 16,
        justifyContent: "center",
        flexWrap: "wrap",
    };

    const spacerStyle = { height: 56 };
    const afterImagesGap = { height: 80 };

    const gridStyle = {
        width: "100%",
        maxWidth: 1200,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 16,
    };

    const cardStyle = {
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(2,6,23,0.06)",
        aspectRatio: "4/3",
        background: "#f3f4f6",
    };

    const imgStyle = {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    };

    const reviewsWrapper = {
        width: "100%",
        maxWidth: 1100,
        textAlign: "center",
    };

    const reviewGrid = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
    };

    const reviewCard = {
        background: "white",
        borderRadius: 16,
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
        padding: "24px 20px",
        textAlign: "left",
        border: "1px solid #e5e7eb",
    };

    const stars = (count) => "⭐".repeat(count);

    // 🚀 handle navigation
    const handleFindProviders = () => {
        const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
        if (isLoggedIn) {
            navigate("/providers");
        } else {
            navigate("/select");
        }
    };

    return (
        <main style={mainStyle}>
            {/* HERO */}
            <div style={heroWrapper}>
                <h1 style={titleStyle}>
                    Connecting You to Trusted Healthcare Providers Worldwide
                </h1>

                <p style={subtitleStyle}>
                    Discover, connect, and book appointments with verified doctors and
                    dentists anywhere in the world.
                </p>

                <div style={buttonsRow}>
                    <button
                        onClick={handleFindProviders}
                        style={{
                            padding: "12px 28px",
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 16,
                            background: "#2563EB",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 6px 14px rgba(37,99,235,0.18)",
                        }}
                    >
                        Find Providers
                    </button>

                    <button
                        onClick={() => navigate("/learn-more")}
                        style={{
                            padding: "12px 28px",
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 16,
                            background: "#fff",
                            color: "#0f172a",
                            border: "2px solid #e2e8f0",
                            cursor: "pointer",
                        }}
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {/* ---------- GAP ---------- */}
            <div style={spacerStyle} />

            {/* IMAGE GRID */}
            <div style={gridStyle}>
                {imageLinks.map((src, i) => (
                    <div key={i} style={cardStyle}>
                        <img
                            src={src}
                            alt={`Healthcare ${i + 1}`}
                            style={imgStyle}
                            loading="lazy"
                            onError={(e) => {
                                e.target.src =
                                    "https://via.placeholder.com/400x300?text=Image+Not+Found";
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* ---------- GAP BEFORE REVIEWS ---------- */}
            <div style={afterImagesGap} />

            {/* REVIEWS SECTION */}
            <div style={reviewsWrapper}>
                <h2
                    style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#1e293b",
                        marginBottom: 32,
                    }}
                >
                    What Our Users Say
                </h2>

                <div style={reviewGrid}>
                    {reviews.map((r, i) => (
                        <div key={i} style={reviewCard}>
                            <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>
                                {stars(r.rating)}
                            </div>
                            <p
                                style={{
                                    fontSize: "1rem",
                                    color: "#475569",
                                    marginBottom: 16,
                                    lineHeight: 1.6,
                                }}
                            >
                                “{r.review}”
                            </p>
                            <strong style={{ color: "#2563EB", fontWeight: 700 }}>
                                — {r.name}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Home;
