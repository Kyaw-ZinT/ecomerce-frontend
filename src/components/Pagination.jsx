// frontend/src/components/Pagination.jsx

import React from "react";
import { Link } from "react-router-dom";

function Pagination({ pages, page, keyword = "", category = "", minPrice = "", maxPrice = "" }) {
  // Query String တွေကို စုစည်းမယ်
  const getQueryString = (pageNum) => {
    let queryString = `?pageNumber=${pageNum}`;
    if (keyword) {
      queryString += `&keyword=${keyword}`;
    }
    if (category) {
      queryString += `&category=${category}`;
    }
    if (minPrice) {
      queryString += `&minPrice=${minPrice}`;
    }
    if (maxPrice) {
      queryString += `&maxPrice=${maxPrice}`;
    }
    return queryString;
  };

  return (
    pages > 1 && ( // pages 1 ထက်များမှ Pagination ကို ပြပါ
      <nav className="flex justify-center mt-8">
        <ul className="flex list-style-none">
          {/* Previous Button */}
          <li className={`${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
            <Link
              to={getQueryString(page - 1)}
              className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 hover:bg-gray-100 rounded-l-md"
              aria-disabled={page === 1}
            >
              Previous
            </Link>
          </li>

          {/* Page Numbers */}
          {[...Array(pages).keys()].map((x) => (
            <li key={x + 1} className={`${x + 1 === page ? "bg-blue-600 text-white" : ""}`}>
              <Link
                to={getQueryString(x + 1)}
                className={`relative block py-2 px-3 leading-tight border border-gray-300 ${
                  x + 1 === page ? "bg-blue-600 text-white" : "bg-white text-blue-700 hover:bg-gray-100"
                }`}
              >
                {x + 1}
              </Link>
            </li>
          ))}

          {/* Next Button */}
          <li className={`${page === pages ? "opacity-50 cursor-not-allowed" : ""}`}>
            <Link
              to={getQueryString(page + 1)}
              className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 hover:bg-gray-100 rounded-r-md"
              aria-disabled={page === pages}
            >
              Next
            </Link>
          </li>
        </ul>
      </nav>
    )
  );
}

export default Pagination;
