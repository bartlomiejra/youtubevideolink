// components/AuthorList.js

import React from 'react';

const AuthorList = ({ authors }) => {
  // Walidacja - sprawdzenie, czy authors jest tablicą i zawiera dane
  if (!Array.isArray(authors) || authors.length === 0) {
    return <p className="text-gray-400">Brak autorów do wyświetlenia.</p>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg font-bold text-gray-200">Autorzy</h2>
      <ul className="list-disc list-inside text-gray-300">
        {authors.map((author, index) => (
          <li key={index} className="py-1">
            {author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;
