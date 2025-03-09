import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { Notyf } from "notyf";

const AdminView = ({ books }) => {
  const notyf = new Notyf();

  const { booksId } = useParams();

  if (!Array.isArray(books)) {
    return (
      <div className="text-red-500">Error: Books data is not available.</div>
    );
  }

  const deleteBook = (bookId) => {
    let token = localStorage.getItem("token");

    axios
      .delete(`https://bookworm-backend-api.onrender.com/deleteBook/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        notyf.success(response.data);
      })
      .catch((error) => {
        notyf.error("Error deleting book");
      });
  };

  return (
    <div className="overflow-x-auto bg-gray-50 p-6 rounded-lg">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-teal-600 text-white">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Content</th>
            <th className="py-3 px-6 text-left">Comments</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-3">
                No books available
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id} className="border-b border-gray-200">
                <td className="py-3 px-6 text-left text-gray-800">
                  {book.title}
                </td>
                <td className="py-3 px-6 text-left text-gray-600">
                  {book.author}
                </td>
               {/* <td className="py-3 px-6 text-left text-gray-600">
                  {book.comments.map((comment) => (
                    <ul key={comment._id} className="list-disc pl-5">
                      <li className="mb-2">
                        <strong>{comment.username}: </strong>
                        {comment.comment}
                        <br />
                        <span className="text-gray-400 text-sm">
                          {comment.date}
                        </span>
                      </li>
                    </ul>
                  ))}
                </td>*/}
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => deleteBook(book._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminView;
