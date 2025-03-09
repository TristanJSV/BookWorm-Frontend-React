import React from "react";
import BookWebsite from "../images/BookWebsite.jpg";
import { useEffect, useState, useContext } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Notyf } from "notyf";

const SingleBookPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [genre, setGenre] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  const { user } = useContext(UserContext);
  const { bookId } = useParams();
  const notyf = new Notyf();

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = () => {
    axios
      .get(`https://bookworm-backend-api.onrender.com/books/getBook/${bookId}`)
      .then((response) => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setIsbn(response.data.isbn);
        setPublishedDate(response.data.publishedDate);
        setGenre(response.data.genre);
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error(error);
        notyf.error("Failed to load post");
      });
  };

  const formatWordDate = (dateString) => {
    const date = new Date(dateString);
    console.log(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const wordDate = formatWordDate(publishedDate);


  return (
    <>
      {/* Book Details */}
      <div className="flex justify-center my-10">
        <div className="max-w-4xl bg-gray-50 border shadow-sm">
          <img className="p-10" src={BookWebsite} alt="Book Cover" />

          <div className="px-10">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-800">
              {title}
            </h5>
            <p className="italic">
              {wordDate}
            </p>
            <p className="text-gray-700 mt-4">
              <strong>Author:</strong> {author}
            </p>
            <p className="text-gray-700">
              <strong>ISBN:</strong> {isbn}
            </p>
            <p className="text-gray-700">
              <strong>Genre:</strong> {genre}
            </p>
          </div>
        </div>
      </div>
    </>
  );

};

export default SingleBookPage;
