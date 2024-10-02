// components/AuthorFilter.js
import React, { useEffect, useState } from 'react';

const AuthorFilter = ({ selectedAuthors, setSelectedAuthors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authors, setAuthors] = useState([]);

  // Wczytywanie autorów z pliku JSON
  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await fetch('/data/authors.json');
      const data = await response.json();
      setAuthors(data);
    };

    fetchAuthors();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (authorName) => {
    if (selectedAuthors.includes(authorName)) {
      setSelectedAuthors(selectedAuthors.filter(name => name !== authorName)); // Usuwa autora
    } else {
      setSelectedAuthors([...selectedAuthors, authorName]); // Dodaje autora
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Wybierz autorów
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {authors.map((author) => (
              <div key={author} className="flex items-center px-4 py-2">
                <input
                  type="checkbox"
                  id={`author-${author}`}
                  checked={selectedAuthors.includes(author)}
                  onChange={() => handleCheckboxChange(author)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor={`author-${author}`} className="ml-2 text-sm text-gray-700">{author}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorFilter;
