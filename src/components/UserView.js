import React from "react";
import Image from "../images/image.jpeg";
import { Link } from "react-router-dom";

const UserView = ({ books }) => {
  if (!books || !Array.isArray(books)) {
    return (
      <div className="text-center text-gray-600 my-60">No Books available.</div>
    );
  }

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <>
      <div className="flex justify-center flex-wrap gap-12 flex-row my-20">
        {[...books].reverse().map((book) => (
          <div key={book._id} class="max-w-sm bg-gray-50">
            <img class="rounded-t-lg w-full" src={Image} alt="Blog Image" />

            <div class="p-5">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-800">
                {book.title}
              </h5>

              <p class="mb-3 font-normal text-gray-600">
                {truncateText(book.author, 100)}
              </p>
              <Link
                to={`/books/${book._id}`}
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 "
              >
                Read more
                <svg
                  class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserView;
