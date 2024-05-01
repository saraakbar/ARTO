import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const displayPages = 5; // Number of pages to display at once
  const halfDisplay = Math.floor(displayPages / 2);

  const startPage = Math.max(1, currentPage - halfDisplay);
  const endPage = Math.min(totalPages, startPage + displayPages - 1);

  const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handlePageChange(1)}
        className={`mr-2 mx-2 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-zinc-800 cursor-not-allowed' : 'bg-zinc-800 text-white'
          }`}
      >
        <FontAwesomeIcon icon={faAngleDoubleLeft} />
      </button>

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className={`mr-2 mx-2 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-zinc-800 cursor-not-allowed' : 'bg-zinc-800 text-white'
          }`}
        disabled={currentPage === 1}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      {pagesToShow.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`mr-2 mx-2 px-3 py-1 rounded ${page === currentPage ? 'bg-zinc-800 text-white' : 'bg-gray-300 text-zinc-800'}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className={`mx-2 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-zinc-800 cursor-not-allowed' : 'bg-zinc-800 text-white'
          }`}
        disabled={currentPage === totalPages}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        className={`ml-2 mx-2 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-zinc-800 cursor-not-allowed' : 'bg-zinc-800 text-white'
          }`}
      >
        <FontAwesomeIcon icon={faAngleDoubleRight} />
      </button>
    </div>
  );
};

export default Pagination;
