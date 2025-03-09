// Dependencies
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookPage from "./pages/BookPage";
import Logout from "./pages/Logout";
import SingleBookPage from "./pages/SingleBookPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    username: null,
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser({ id: null, isAdmin: false, username: "Guest" });
      return;
    }

    axios
      .get("https://bookworm-backend-api.onrender.com/users/details", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.user) {
          setUser({
            id: response.data.user._id,
            isAdmin: response.data.user.isAdmin,
            username: response.data.user.username,
            email: response.data.user.email,
          });
        } else {
          setUser({ id: null, isAdmin: null, username: "Guest" });
        }
      });
  }, []);

  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books" element={<BookPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/books/:bookId" element={<SingleBookPage />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
          <Footer />
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
