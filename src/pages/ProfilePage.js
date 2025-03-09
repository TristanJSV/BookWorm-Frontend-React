import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../images/image.jpeg";
import NoProfile from "../images/no-profile.png";

const ProfilePage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [genre, setGenre] = useState("");

  const [bookId, setBookId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newIsbn, setNewIsbn] = useState("");
  const [newGenre, setNewGenre] = useState("");

  const [myBooks, setMyBooks] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const openEditModal = (book) => {
    setNewTitle(book.title); // Prefill the title
    setNewAuthor(book.author); // Prefill the author
    setBookId(book._id);
    setIsEditModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const createNewBook = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");

    axios
      .post(
        "https://bookworm-backend-api.onrender.com/books/addBook",
        {
          title: title,
          author: author,
          isbn: isbn,
          genre: genre
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setIsModalOpen(false);
        fetchMyBooks();
        notyf.success("Created New Book");
      })
      .catch((error) => {
        console.error(error);
        notyf.error("Error Cannot Create New Book");
      });
  };

  const updateBook = (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");

    axios
      .patch(
        `https://bookworm-backend-api.onrender.com/updateBook/${bookId}`,
        {
          title: newTitle,
          author: newAuthor,
          isbn: newIsbn,
          genre: newGenre
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setIsEditModalOpen(false);
        fetchMyBooks();
        notyf.success("Updated");
      })
      .catch((error) => {
        console.error(error);
        notyf.error("Error cannot update");
      });
  };

  const fetchMyBooks = () => {
    let token = localStorage.getItem("token");

    axios
      .get("https://bookworm-backend-api.onrender.com/books/getMyBook", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setMyBooks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMyBooks();
  }, [user]);

  return (
    <>
      <div className="my-10 lg:mx-20 mx-3 lg:ps-16 grid grid-cols-5">
        <div className="flex flex-col text-left gap-4">
          <h1 className="text-2xl font-bold text-teal-600">User Details</h1>
          <hr />
          <div className="text-left text-gray-800">
            <img className="size-14 mb-4" src={NoProfile} alt="avatar" />
            <p className="font-medium">{user.username}</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:mx-20 my-5 lg:my-0 lg:col-span-4 col-span-5">
          <button
            type="button"
            className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center me-2 flex justify-center w-60 mb-4"
            onClick={toggleModal} // Toggle the modal when button is clicked
          >
            <svg
              className="w-3.5 h-3.5 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M12.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-.707.293H6a1 1 0 0 1-1-1V9a1 1 0 0 1 .293-.707l7-7a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-7 7H9a1 1 0 0 1-.707-.293l-4-4a1 1 0 0 1 0-1.414l7-7z" />
            </svg>
            Create New Book
          </button>
          {[...myBooks].reverse().map((book) => (
            <div
              key={book._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={Image}
                alt={book.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h2>

                <h2 className="text-lg font-semibold text-gray-800">
                  {book.author}
                </h2>
                <p className="text-gray-500 mt-2">
                  {new Date(book.publishedDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>

                <button
                  className="mt-4 px-6 py-2 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-800 transition"
                  onClick={() => openEditModal(book)}
                >
                  Edit
                </button>

                <button className="mt-4 px-6 py-2 mx-2 border-2 border-teal-600 text-teal-600 font-medium rounded-lg  hover:bg-teal-600 hover:text-white transition">
                  <Link to={`/books/${book._id}`}>View Book</Link>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Book Modal */}
        {isEditModalOpen && (
          <div
            id="edit-modal"
            tabIndex="-1"
            aria-hidden={!isEditModalOpen}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center bg-black bg-opacity-50"
          >
            <div className="relative w-full max-w-4xl">
              <div className="relative bg-teal-50 rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-teal-600">
                  <h3 className="text-lg font-semibold text-teal-900">
                    Edit Book
                  </h3>
                  <button
                    type="button"
                    onClick={toggleEditModal}
                    className="text-teal-400 bg-transparent hover:bg-teal-200 hover:text-teal-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form className="p-4 md:p-5" onSubmit={updateBook}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Title
                      </label>
                      <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Enter title"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="author"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Author
                      </label>
                      <input
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Write Author"
                      ></input>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="genre"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Genre
                      </label>
                      <input
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Write Genre"
                      ></input>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="isbn"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        ISBN
                      </label>
                      <input
                        value={newIsbn}
                        onChange={(e) => setNewIsbn(e.target.value)}
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Write ISBN"
                      ></input>
                    </div>

                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Create New Book Modal */}
        {isModalOpen && (
          <div
            id="crud-modal"
            tabIndex="-1"
            aria-hidden={!isModalOpen}
            className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center bg-black bg-opacity-50"
          >
            <div className="relative w-full max-w-4xl">
              <div className="relative bg-teal-50 rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-teal-600">
                  <h3 className="text-lg font-semibold text-teal-900">
                    Create New Book
                  </h3>
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="text-teal-400 bg-transparent hover:bg-teal-200 hover:text-teal-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form className="p-4 md:p-5" onSubmit={createNewBook}>
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Title
                      </label>
                      <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        name="name"
                        id="name"
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Enter title"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="Author"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Author
                      </label>
                      <input
                        onChange={(e) => setAuthor(e.target.value)}
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Enter Author"
                      ></input>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="Genre"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        Genre
                      </label>
                      <input
                        onChange={(e) => setGenre(e.target.value)}
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Enter Genre"
                      ></input>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="ISBN"
                        className="block mb-2 text-sm font-medium text-teal-900"
                      >
                        ISBN
                      </label>
                      <input
                        onChange={(e) => setIsbn(e.target.value)}
                        className="bg-teal-50 border border-teal-300 text-teal-900 text-sm rounded-lg focus:ring-teal-600 focus:border-teal-600 block w-full p-2.5"
                        placeholder="Enter ISBN"
                      ></input>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    <svg
                      className="me-1 -ms-1 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Add Book
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
