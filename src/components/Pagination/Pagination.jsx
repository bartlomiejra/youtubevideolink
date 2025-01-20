import React from 'react';

const Pagination = ({ currentPage, totalPages, onPrevPage, onNextPage }) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      {/* Przycisk poprzedniej strony */}
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
      >
        Poprzednia
      </button>

      {/* Numer strony */}
      <span className="text-gray-200">
        Strona {currentPage} z {totalPages}
      </span>

      {/* Przycisk następnej strony */}
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
      >
        Następna
      </button>
    </div>
  );
};

export default Pagination;
