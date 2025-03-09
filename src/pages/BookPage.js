import React, { useContext, useState, useEffect } from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";
import UserContext from "../context/UserContext";
import axios from "axios";

const BookPage = () => {
  const { user } = useContext(UserContext);

  const [allBooks, setAllBooks] = useState([]);  // Stores all books from API
  const [filteredBooks, setFilteredBooks] = useState([]); // Stores search results
  const [searchQuery, setSearchQuery] = useState(""); // Stores user input

  // Fetch all books when the page loads
  useEffect(() => {
    axios
      .get("http://localhost:4000/books/getAllBooks")
      .then((response) => {
        setAllBooks(response.data);
        setFilteredBooks(response.data); // Initially show all books
      })
      .catch((error) => {
        console.error("Error fetching books", error);
      });
  }, []);

  // Function to filter books based on search query
  const searchBooks = (query) => {
    setSearchQuery(query); // Update input field

    if (query.trim() === "") {
      setFilteredBooks(allBooks); // Restore full book list
    } else {
      const filtered = allBooks.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchQuery}
        onChange={(e) => searchBooks(e.target.value)}
        style={{
          padding: "12px",
          width: "50%", // Adjust width for better alignment
          marginBottom: "20px",
          fontSize: "16px",
          borderRadius: "8px", // Rounded corners for a modern look
          border: "1px solid #ccc", // Lighter border
          outline: "none",
          display: "block",
          margin: "0 auto", // Centering
        }}
      />


      {/* Conditionally Render Admin or User View */}
      {user.isAdmin ? <AdminView books={filteredBooks} /> : <UserView books={filteredBooks} />}
    </div>
  );
};

export default BookPage;
